import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "sherry xinrui liu — portfolio v2026.0";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
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
          fontFamily: "serif",
          padding: "60px",
        }}
      >
        {/* Portfolio title */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            marginBottom: "8px",
          }}
        >
          <span
            style={{
              fontSize: "64px",
              fontStyle: "italic",
              color: "#2c2c2c",
            }}
          >
            portfolio
          </span>
          <span
            style={{
              fontSize: "18px",
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
            fontSize: "20px",
            color: "#5a5a5a",
            fontFamily: "sans-serif",
            letterSpacing: "0.05em",
            marginBottom: "40px",
          }}
        >
          [sherry xinrui liu]
        </span>

        {/* Hero section preview */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "48px",
            padding: "32px 48px",
            background: "rgba(255,255,255,0.4)",
            borderRadius: "16px",
          }}
        >
          {/* Headshot placeholder with border */}
          <div
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "8px",
              background: "linear-gradient(135deg, #d6cfc6 0%, #c4bdb4 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "64px",
              flexShrink: 0,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://api.dicebear.com/7.x/initials/svg?seed=SL&backgroundColor=d6cfc6"
              alt=""
              width={160}
              height={160}
              style={{ borderRadius: "8px" }}
            />
          </div>

          {/* Text content */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            <span
              style={{
                fontSize: "26px",
                color: "#625F56",
                fontFamily: "sans-serif",
                fontWeight: 600,
              }}
            >
              Welcome to my corner of the internet
            </span>
            <span
              style={{
                fontSize: "20px",
                color: "#625F56",
                fontFamily: "sans-serif",
              }}
            >
              <span style={{ fontWeight: 600 }}>product manager & designer</span>{" "}
              creating better
            </span>
            <span
              style={{
                fontSize: "20px",
                color: "#625F56",
                fontFamily: "sans-serif",
              }}
            >
              web UX for underserved communities
            </span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
