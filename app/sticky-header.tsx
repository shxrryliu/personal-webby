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
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [update]);

  return (
    <header
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={[
        "fixed top-0 left-0 right-0 z-50 cursor-pointer border-b border-warm-gray/40 bg-cream/90 backdrop-blur-sm",
        "transition-[opacity,transform] duration-300 ease-out",
        visible
          ? "translate-y-0 opacity-100"
          : "-translate-y-full opacity-0 pointer-events-none",
      ].join(" ")}
    >
      <div className="mx-auto flex max-w-3xl items-baseline gap-2 px-6 py-3">
        <span className="font-serif text-lg italic">portfolio</span>
        <span className="text-xs tracking-wide text-charcoal-light">
          v2026.0
        </span>
        <span className="text-xs text-charcoal-light">
          &mdash; [sherry xinrui liu]
        </span>
      </div>
    </header>
  );
}
