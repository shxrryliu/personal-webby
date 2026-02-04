"use client";

import { useRef, useState, useCallback, useEffect, ReactNode } from "react";

const SCALE = 1.5;
const LENS_SIZE = 150;

export function MagnifyPage({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [containerPos, setContainerPos] = useState({ x: 0, y: 0 });
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ x: e.clientX, y: e.clientY });
    setContainerPos({
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

  const lensEnabled = active && !prefersReduced;
  const containerWidth = containerRef.current?.scrollWidth ?? 0;
  const containerHeight = containerRef.current?.scrollHeight ?? 0;
  const half = LENS_SIZE / 2;

  return (
    <div
      ref={containerRef}
      className="group/magnify relative"
      data-magnify-active={active || undefined}
      onMouseMove={handleMouseMove}
      onClick={handleClick}
      style={{ cursor: lensEnabled ? "none" : undefined }}
    >
      {children}

      {lensEnabled && (
        <div
          className="pointer-events-none fixed z-50 overflow-hidden rounded-full border border-warm-gray/70 shadow-md"
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
              left: -(containerPos.x * SCALE) + half,
              top: -(containerPos.y * SCALE) + half,
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
