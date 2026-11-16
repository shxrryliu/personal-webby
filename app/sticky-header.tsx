"use client";

import { useEffect, useState, useCallback } from "react";

export function StickyHeader({ targetId }: { targetId: string }) {
  const [visible, setVisible] = useState(false);

  const update = useCallback(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    setVisible(rect.bottom < 0);
  }, [targetId]);

  useEffect(() => {
    // Read the starting position on the next frame, then follow scrolling.
    const frame = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, [update]);

  return (
    <header
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
        "fixed top-0 left-0 right-0 z-50 cursor-pointer bg-oxblood/95 text-bone backdrop-blur-sm",
        "transition-[opacity,transform] duration-300 ease-out",
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="flex items-baseline justify-between px-6 py-3 md:px-14">
        <span className="font-display text-2xl uppercase leading-none tracking-[-0.03em]">
          Sherry Liu
        </span>
        <span className="font-type text-xs uppercase tracking-[0.2em]">
          Issue 2026.0
        </span>
      </div>
    </header>
  );
}
