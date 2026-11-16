import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the masthead's S in bone on an oxblood tile. */
export default function AppleIcon() {
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
          borderRadius: 0,
          fontFamily: "Bodoni Moda",
          fontSize: 172,
          lineHeight: 1,
          paddingBottom: 6,
        }}
      >
        S
      </div>
    ),
    { ...size, fonts: [{ name: "Bodoni Moda", data: bodoni, style: "normal" }] }
  );
}
