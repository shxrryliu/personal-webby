import sharp from "sharp";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const inputSvg = join(root, "public/images/headshot.svg");
const outputWebp = join(root, "public/images/headshot.webp");
const blurTsPath = join(root, "app/headshot-blur.ts");

// 2x display size: component renders at ~175w, so 350px wide
const OUTPUT_WIDTH = 350;

// SVG geometry (from the original SVG viewBox=175x246)
const SVG_WIDTH = 175;
const SVG_HEIGHT = 246;
const RECT_X = 3.50668;
const RECT_Y = -45.3885;
const RECT_W = 226.264;
const RECT_H = 301.685;

async function main() {
  console.log("Converting headshot SVG → WebP...");

  // 1. Extract the base64 PNG from the SVG
  const svgContent = readFileSync(inputSvg, "utf-8");
  const b64Match = svgContent.match(
    /xlink:href="data:image\/png;base64,([^"]+)"/
  );
  if (!b64Match) throw new Error("Could not find base64 image in SVG");

  const photoBuffer = Buffer.from(b64Match[1], "base64");
  const photoMeta = await sharp(photoBuffer).metadata();
  console.log(`Extracted photo: ${photoMeta.width}x${photoMeta.height}`);

  // 2. Compute scale factor for 2x output
  const scale = OUTPUT_WIDTH / SVG_WIDTH;
  const outHeight = Math.round(SVG_HEIGHT * scale);
  console.log(`Output canvas: ${OUTPUT_WIDTH}x${outHeight} (${scale}x)`);

  // 3. Resize the photo to fill the rect at the target scale
  const rectW = Math.round(RECT_W * scale);
  const rectH = Math.round(RECT_H * scale);
  const rectX = Math.round(RECT_X * scale);
  const rectY = Math.round(RECT_Y * scale);

  const resizedPhoto = await sharp(photoBuffer)
    .resize(rectW, rectH, { fit: "fill" })
    .png()
    .toBuffer();

  // 4. Compose the photo onto a transparent canvas at the correct position
  // sharp compositing needs non-negative offsets, so we may need to crop
  const cropTop = Math.max(0, -rectY);
  const cropLeft = Math.max(0, -rectX);
  const pasteTop = Math.max(0, rectY);
  const pasteLeft = Math.max(0, rectX);

  // Crop the resized photo to remove parts outside the canvas
  const visibleW = Math.min(rectW - cropLeft, OUTPUT_WIDTH - pasteLeft);
  const visibleH = Math.min(rectH - cropTop, outHeight - pasteTop);

  const croppedPhoto = await sharp(resizedPhoto)
    .extract({
      left: cropLeft,
      top: cropTop,
      width: visibleW,
      height: visibleH,
    })
    .png()
    .toBuffer();

  // 5. Create the mask SVG (just the silhouette path, scaled to output size)
  // Extract the mask path from the original SVG
  const pathMatch = svgContent.match(/<path d="([^"]+)" fill="#D9D9D9"\/>/);
  if (!pathMatch) throw new Error("Could not find mask path in SVG");

  const maskSvg = `<svg width="${OUTPUT_WIDTH}" height="${outHeight}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <path d="${pathMatch[1]}" fill="white"/>
  </svg>`;

  const maskBuffer = await sharp(Buffer.from(maskSvg))
    .resize(OUTPUT_WIDTH, outHeight)
    .grayscale()
    .png()
    .toBuffer();

  // 6. Create the canvas, composite photo, then apply mask
  const canvas = await sharp({
    create: {
      width: OUTPUT_WIDTH,
      height: outHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: croppedPhoto, top: pasteTop, left: pasteLeft }])
    .png()
    .toBuffer();

  // Apply the mask: use dest-in compositing
  const masked = await sharp(canvas)
    .composite([{ input: maskBuffer, blend: "dest-in" }])
    .png()
    .toBuffer();

  // 7. Add drop shadow: create a blurred version of the mask, offset by 4px (scaled)
  const shadowOffset = Math.round(4 * scale);
  const shadowBlur = Math.round(2 * scale);

  // Create shadow layer: the mask shape in semi-transparent black, blurred
  const shadowShape = await sharp(Buffer.from(maskSvg))
    .resize(OUTPUT_WIDTH, outHeight)
    .ensureAlpha()
    .png()
    .toBuffer();

  // Make it semi-transparent black
  const shadowColored = await sharp({
    create: {
      width: OUTPUT_WIDTH,
      height: outHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: Math.round(255 * 0.2) },
    },
  })
    .composite([{ input: shadowShape, blend: "dest-in" }])
    .blur(shadowBlur < 0.5 ? 0.5 : shadowBlur + 0.5)
    .png()
    .toBuffer();

  // Final composite: shadow (offset) + masked image
  const final = await sharp({
    create: {
      width: OUTPUT_WIDTH,
      height: outHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: shadowColored, top: shadowOffset, left: 0 },
      { input: masked, top: 0, left: 0 },
    ])
    .png()
    .toBuffer();

  // 8. Convert to WebP
  const webpBuffer = await sharp(final).webp({ quality: 85 }).toBuffer();
  writeFileSync(outputWebp, webpBuffer);
  console.log(
    `Saved headshot.webp (${(webpBuffer.length / 1024).toFixed(1)} KB)`
  );

  // 9. Generate tiny blur placeholder (16px wide)
  const blurBuffer = await sharp(final)
    .resize(16)
    .webp({ quality: 20 })
    .toBuffer();
  const blurDataURL = `data:image/webp;base64,${blurBuffer.toString("base64")}`;
  console.log(
    `Blur placeholder: ${blurDataURL.length} chars (${(blurBuffer.length / 1024).toFixed(1)} KB)`
  );

  // 10. Write blurDataURL to TypeScript file
  const tsContent = `// Auto-generated by scripts/convert-headshot.mjs — do not edit
export const headshotBlurDataURL =
  "${blurDataURL}";
`;
  writeFileSync(blurTsPath, tsContent);
  console.log(`Wrote headshot-blur.ts`);

  console.log(
    "\nDone! Verify the WebP output visually before deleting the SVG."
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
