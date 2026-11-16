import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "Sherry Liu: designer, engineer, writer";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

/** Link-preview card in the cover's colours: the SHERRY masthead on oxblood. */
export default async function Image() {
  // Bodoni Moda (display cut), SIL Open Font License.
  const bodoni = readFileSync(join(process.cwd(), "app/BodoniModa-Display.ttf"));

  return new ImageResponse(
    (
      <div
        style={{
          background: "#6E1F24",
          color: "#EDE6DA",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Bodoni Moda",
        }}
      >
        <div
          style={{
            fontSize: "300px",
            lineHeight: 1,
            letterSpacing: "-0.05em",
          }}
        >
          SHERRY
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "28px",
            fontSize: "40px",
            color: "#E8B04A",
          }}
        >
          Designer · Engineer · Writer
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Bodoni Moda", data: bodoni, style: "normal" }],
    }
  );
}
