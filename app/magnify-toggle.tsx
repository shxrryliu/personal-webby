"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const WORK_CARDS = [
  { title: "Contracted PM/Designer for Sway", gradientColor: "#ddd6e9" },
  { title: '"Write your own" Quiz Question', gradientColor: "#d4dde9" },
  { title: "California Takeoff", gradientColor: "#d0ded4" },
  { title: "Harvard Tech for Social Good", gradientColor: "#d2d5e2" },
];

const DEFAULT_COLOR = "#d6cfc6";

export function MagnifyToggle({ targetId }: { targetId: string }) {
  const [show, setShow] = useState(false);
  const [activeColor, setActiveColor] = useState(DEFAULT_COLOR);
  const [isActive, setIsActive] = useState(false);

  const update = useCallback(() => {
    const target = document.getElementById(targetId);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    setShow(rect.bottom < 0);

    // Find which work card is most centered on screen
    const viewportCenter = window.innerHeight / 2;
    let closestCard: { title: string; gradientColor: string } | null = null;
    let closestDistance = Infinity;

    WORK_CARDS.forEach((card) => {
      const cardElements = document.querySelectorAll("article");
      cardElements.forEach((el) => {
        const h2 = el.querySelector("h2");
        if (h2?.textContent?.includes(card.title.substring(0, 20))) {
          const cardRect = el.getBoundingClientRect();
          const cardCenter = cardRect.top + cardRect.height / 2;
          const distance = Math.abs(cardCenter - viewportCenter);
          if (distance < closestDistance && cardRect.top < window.innerHeight && cardRect.bottom > 0) {
            closestDistance = distance;
            closestCard = card;
          }
        }
      });
    });

    if (closestCard) {
      setActiveColor(closestCard.gradientColor);
    } else {
      setActiveColor(DEFAULT_COLOR);
    }
  }, [targetId]);

  // Sync with magnify state from parent
  useEffect(() => {
    const container = document.querySelector("[data-magnify-active]");
    setIsActive(!!container);

    const observer = new MutationObserver(() => {
      const container = document.querySelector("[data-magnify-active]");
      setIsActive(!!container);
    });

    const root = document.querySelector(".group\\/magnify");
    if (root) {
      observer.observe(root, { attributes: true, attributeFilter: ["data-magnify-active"] });
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return (
    <button
      data-magnify-trigger
      data-magnify-toggle
      aria-label="Toggle magnifying glass"
      aria-pressed={isActive}
      className={[
        "fixed bottom-6 right-6 z-40 hidden md:flex",
        "h-14 w-24 items-center rounded-full",
        "border border-warm-gray/40",
        "shadow-sm hover:shadow-md",
        "transition-all duration-300 ease-out",
        "cursor-pointer",
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none",
      ].join(" ")}
      style={{
        backgroundColor: isActive ? activeColor : "#c4bdb4",
      }}
    >
      {/* Toggle knob with magnifying glass */}
      <div
        className={[
          "flex h-11 w-11 items-center justify-center rounded-full",
          "bg-white shadow-md",
          "transition-all duration-300 ease-out",
          isActive ? "translate-x-[calc(100%-2px)] ml-1" : "translate-x-0.5",
        ].join(" ")}
      >
        <div
          className="relative h-7 w-7"
          style={{
            filter: isActive ? "none" : "grayscale(100%) opacity(0.5)",
            transition: "filter 0.3s ease-out",
          }}
        >
          <Image
            src="/icon.svg"
            alt="Magnifying glass"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </button>
  );
}
