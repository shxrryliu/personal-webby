"use client";

import { useEffect, useState, useCallback } from "react";

export function MagnifyJar({ targetId }: { targetId: string }) {
  const [show, setShow] = useState(false);

  const update = useCallback(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    setShow(rect.bottom < 0);
  }, [targetId]);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [update]);

  return (
    <button
      data-magnify-trigger
      aria-label="Toggle magnifying glass"
      className={[
        "fixed bottom-6 right-6 z-40 hidden md:flex",
        "h-14 w-10 items-end justify-center rounded-md",
        "border border-warm-gray/60 bg-cream/90 backdrop-blur-sm",
        "shadow-sm hover:shadow-md",
        "transition-[opacity,transform] duration-300 ease-out",
        "cursor-pointer",
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none",
      ].join(" ")}
    >
      {/* Jar body */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="44"
        viewBox="0 0 28 44"
        fill="none"
        className="mb-1 origin-bottom transition-transform"
        style={{ animation: "none" }}
        onMouseEnter={(e) => { e.currentTarget.style.animation = "shake 0.4s ease"; }}
        onAnimationEnd={(e) => { e.currentTarget.style.animation = "none"; }}
      >
        {/* Lid */}
        <rect x="4" y="0" width="20" height="4" rx="1" fill="#b0a899" />
        {/* Lid rim */}
        <rect x="2" y="4" width="24" height="3" rx="1" fill="#c4bbb0" />
        {/* Jar body */}
        <path
          d="M4 7 C4 7, 3 12, 3 18 C3 30, 3 34, 5 38 C6 40, 8 42, 14 42 C20 42, 22 40, 23 38 C25 34, 25 30, 25 18 C25 12, 24 7, 24 7 Z"
          fill="#e8e1d8"
          stroke="#c4bbb0"
          strokeWidth="1"
        />
        {/* Magnifying glass inside jar (shown when NOT active) */}
        <g className="group-data-[magnify-active]/magnify:hidden">
          {/* Glass circle */}
          <circle cx="12" cy="22" r="5" fill="none" stroke="#8a8078" strokeWidth="1.5" />
          {/* Handle */}
          <line x1="16" y1="26" x2="20" y2="32" stroke="#8a8078" strokeWidth="1.5" strokeLinecap="round" />
        </g>
        {/* Empty jar label (shown when active) */}
        <g className="hidden group-data-[magnify-active]/magnify:block">
          <line x1="9" y1="24" x2="19" y2="24" stroke="#c4bbb0" strokeWidth="0.8" />
          <line x1="10" y1="27" x2="18" y2="27" stroke="#c4bbb0" strokeWidth="0.8" />
        </g>
      </svg>
    </button>
  );
}
