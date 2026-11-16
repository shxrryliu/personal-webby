import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Favicon: the masthead's S in bone on an oxblood tile. */
export default function Icon() {
  // Bodoni Moda (display cut), SIL Open Font License.
  const bodoni = readFileSync(join(process.cwd(), "app/BodoniModa-Display.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#6E1F24",
          color: "#EDE6DA",
          borderRadius: 14,
          fontFamily: "Bodoni Moda",
          fontSize: 62,
          lineHeight: 1,
          paddingBottom: 2,
          // Thickens Bodoni's hairlines so the S survives at 16px.
          WebkitTextStroke: "2.5px #EDE6DA",
        }}
      >
        S
      </div>
    ),
    { ...size, fonts: [{ name: "Bodoni Moda", data: bodoni, style: "normal" }] }
  );
}
