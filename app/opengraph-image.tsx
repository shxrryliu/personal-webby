import { ImageResponse } from "next/og";
import { readFileSync } from "fs";
import { join } from "path";

export const alt =
  "Sherry Liu looking through a magnifying glass";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const OXBLOOD = "#6E1F24";
const BONE = "#EDE6DA";
const COBALT = "#1A2FD0";

// The portrait is drawn 640px tall; its lens sits here within that box.
/** Set to true to put the SHERRY masthead behind the portrait. */
const MASTHEAD = false;

const PORTRAIT = { width: 455, height: 640, left: 372, top: MASTHEAD ? 96 : 26 };
const LENS = { cx: 231, cy: 166, r: 93 };

/** Link-preview card: the portrait on oxblood with the cobalt pen loop, and no words. */
export default async function Image() {
  const read = (file: string) => readFileSync(join(process.cwd(), "app", file));
  // Bodoni Moda, SIL Open Font License.
  const bodoni = read("BodoniModa-Display.ttf");
  const portrait = `data:image/png;base64,${read("og-portrait.png").toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          background: OXBLOOD,
          backgroundImage: `radial-gradient(ellipse 46% 80% at 50% 55%, #93323a 0%, #7d262c 40%, ${OXBLOOD} 100%)`,
          color: BONE,
          fontFamily: "Bodoni Moda",
        }}
      >
        {MASTHEAD && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: -34,
              width: 1200,
              display: "flex",
              justifyContent: "center",
              fontSize: 316,
              lineHeight: 1,
              letterSpacing: "-0.05em",
            }}
          >
            SHERRY
          </div>
        )}

        {/* next/og renders a plain <img>; next/image does not apply here */}
        <img
          src={portrait}
          alt=""
          width={PORTRAIT.width}
          height={PORTRAIT.height}
          style={{ position: "absolute", left: PORTRAIT.left, top: PORTRAIT.top }}
        />

        {/* cobalt pen loop round the lens */}
        <svg
          width={PORTRAIT.width}
          height={PORTRAIT.height}
          viewBox={`0 0 ${PORTRAIT.width} ${PORTRAIT.height}`}
          style={{ position: "absolute", left: PORTRAIT.left, top: PORTRAIT.top }}
        >
          <path
            d={`M${LENS.cx - 4} ${LENS.cy - LENS.r} C${LENS.cx + 48} ${LENS.cy - LENS.r - 3} ${LENS.cx + LENS.r + 2} ${LENS.cy - 50} ${LENS.cx + LENS.r} ${LENS.cy + 2} C${LENS.cx + LENS.r - 2} ${LENS.cy + 54} ${LENS.cx + 50} ${LENS.cy + LENS.r} ${LENS.cx - 2} ${LENS.cy + LENS.r} C${LENS.cx - 52} ${LENS.cy + LENS.r - 1} ${LENS.cx - LENS.r} ${LENS.cy + 48} ${LENS.cx - LENS.r + 1} ${LENS.cy - 4} C${LENS.cx - LENS.r + 2} ${LENS.cy - 54} ${LENS.cx - 46} ${LENS.cy - LENS.r + 2} ${LENS.cx + 8} ${LENS.cy - LENS.r + 3} C${LENS.cx + 28} ${LENS.cy - LENS.r + 5} ${LENS.cx + 46} ${LENS.cy - LENS.r + 14} ${LENS.cx + 58} ${LENS.cy - LENS.r + 24}`}
            fill="none"
            stroke={COBALT}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Bodoni Moda", data: bodoni, style: "normal" },
      ],
    }
  );
}
