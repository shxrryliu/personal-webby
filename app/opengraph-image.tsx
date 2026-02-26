import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt = "sherry xinrui liu — portfolio v2026.0";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  const playfairItalic = readFileSync(
    join(process.cwd(), "app/PlayfairDisplay-Italic.ttf")
  );

  return new ImageResponse(
    (
      <div
        style={{
          background: "#f0ebe4",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Portfolio title */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginBottom: "12px",
          }}
        >
          <span
            style={{
              fontSize: "80px",
              fontFamily: "Playfair Display",
              fontStyle: "italic",
              color: "#2c2c2c",
            }}
          >
            portfolio
          </span>
          <span
            style={{
              fontSize: "22px",
              color: "#5a5a5a",
              fontFamily: "sans-serif",
            }}
          >
            v2026.0
          </span>
        </div>

        {/* Name */}
        <span
          style={{
            fontSize: "24px",
            color: "#5a5a5a",
            fontFamily: "sans-serif",
            letterSpacing: "0.05em",
          }}
        >
          [sherry xinrui liu]
        </span>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Playfair Display",
          data: playfairItalic,
          style: "italic",
        },
      ],
    }
  );
}
