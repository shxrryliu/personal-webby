// Builds public/images/headshot-cutout.webp from the original portrait photo.
//
//   1. Cut the subject out of the photo (macOS only, uses Apple's Vision framework):
//        swift scripts/cutout-headshot.swift original-photo.png /tmp/subject.png
//   2. Crop, sharpen and compress it:
//        npm run convert-headshot -- /tmp/subject.png
//
// The original photo (3024x4032) is not in the repo; it is embedded in
// public/images/headshot.svg in git history (the commit before 617070c).
import sharp from "sharp";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const input = process.argv[2];
if (!input) {
  console.error("Usage: npm run convert-headshot -- <subject.png>");
  process.exit(1);
}

// Framing within the 3024x4032 photo. Keeps the 175:246 shape the cover is laid out for.
const CROP = { left: 0, top: 580, width: 2400, height: 3374 };
// The cover shows the portrait up to ~700px wide, so 1600px covers 2x screens.
const OUTPUT_WIDTH = 1600;

const out = join(root, "public/images/headshot-cutout.webp");
const cropped = sharp(input).extract(CROP);

// Colour: sharpened on its own, so the sharpening can't ring against the transparent edge.
const rgb = await cropped
  .clone()
  .removeAlpha()
  .resize({ width: OUTPUT_WIDTH })
  .sharpen({ sigma: 0.9 })
  .png()
  .toBuffer();

// Edge: pull the mask in by a couple of pixels to drop the light fringe picked up
// from the background, then feather it so the outline is smooth. sharp runs the
// operations of one pipeline in its own fixed order, so each step is its own pass.
const mask = await cropped.clone().extractChannel("alpha").png().toBuffer();
const softened = await sharp(mask).blur(3).png().toBuffer();
const eroded = await sharp(softened).linear(3, -420).png().toBuffer();
const alpha = await sharp(eroded)
  .blur(1.2)
  .resize({ width: OUTPUT_WIDTH })
  .png()
  .toBuffer();

const info = await sharp(rgb)
  .joinChannel(alpha)
  .webp({ quality: 88, alphaQuality: 100 })
  .toFile(out);
console.log(`Saved headshot-cutout.webp ${info.width}x${info.height} (${(info.size / 1024).toFixed(0)} KB)`);
