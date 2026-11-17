/** Fine film grain as an inline SVG noise texture: mid-grey on average, so it adds texture without shifting colour. */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220"><filter id="n" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0 1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>',
)}")`;

/** Slow, cloudy variation in tone, like an unevenly rolled ground of paint or plaster. */
const MOTTLE = `url("data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024"><filter id="m" color-interpolation-filters="sRGB"><feTurbulence type="fractalNoise" baseFrequency="0.0078125" numOctaves="3" seed="5" stitchTiles="stitch"/><feColorMatrix values="0.3 0.3 0.3 0 0.05  0.3 0.3 0.3 0 0.05  0.3 0.3 0.3 0 0.05  0 0 0 0 1"/></filter><rect width="100%" height="100%" filter="url(#m)"/></svg>',
)}")`;

/**
 * Surface laid over the whole site (cover, strip and opened spreads): cloudy
 * mottling under fine print grain, so everything reads as painted paper
 * rather than a flat screen. It never takes clicks.
 */
export function Grain() {
  // Two separate fixed layers: each must blend with the page itself, so they
  // can't share a wrapper (a wrapper would isolate them and turn them to haze).
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[85]"
        style={{ backgroundImage: MOTTLE, mixBlendMode: "soft-light", opacity: 0.2 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[85]"
        style={{ backgroundImage: GRAIN, mixBlendMode: "overlay", opacity: 0.3 }}
      />
    </>
  );
}
