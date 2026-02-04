"use client";

import { useRef, useState, useCallback, ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

const SCALE = 1.5;
const LENS_SIZE = 150;

export function MagnifyHero({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [inside, setInside] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const prefersReduced = useReducedMotion();

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("[data-magnify-trigger]")) {
      setActive((prev) => !prev);
    }
  }, []);

  if (prefersReduced) return <>{children}</>;

  const showLens = active && inside;
  const containerWidth = containerRef.current?.offsetWidth ?? 0;
  const containerHeight = containerRef.current?.offsetHeight ?? 0;
  const half = LENS_SIZE / 2;

  return (
    <div
      ref={containerRef}
      className="group/magnify relative"
      data-magnify-active={active || undefined}
      onMouseEnter={() => setInside(true)}
      onMouseLeave={() => setInside(false)}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{ cursor: active ? "none" : undefined }}
    >
      {children}

      {showLens && (
        <div
          className="pointer-events-none absolute z-30 overflow-hidden rounded-full border border-warm-gray/70 shadow-md"
          style={{
            width: LENS_SIZE,
            height: LENS_SIZE,
            left: pos.x - half,
            top: pos.y - half,
            willChange: "left, top",
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              width: containerWidth,
              height: containerHeight,
              left: -(pos.x * SCALE) + half,
              top: -(pos.y * SCALE) + half,
              transform: `scale(${SCALE})`,
              transformOrigin: "0 0",
            }}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
