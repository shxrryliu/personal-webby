"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function HeroImage({
  src,
  alt,
  width,
  height,
  className,
  blurDataURL,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  blurDataURL?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  // With reduced motion: show immediately, no animation
  const skipAnimation = prefersReduced;

  return (
    <div className="overflow-hidden">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={className}
        style={{
          width: width,
          height: "auto",
          opacity: skipAnimation || isLoaded ? 1 : 0,
          filter: skipAnimation
            ? "none"
            : isLoaded
              ? "blur(0px)"
              : "blur(12px)",
          transform: skipAnimation
            ? "none"
            : isLoaded
              ? "scale(1)"
              : "scale(1.02)",
          transition: skipAnimation
            ? "none"
            : "opacity 400ms cubic-bezier(0.25, 0.1, 0.25, 1), filter 1200ms cubic-bezier(0.25, 0.1, 0.25, 1), transform 1200ms cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
        placeholder={blurDataURL ? "blur" : undefined}
        blurDataURL={blurDataURL}
        priority
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
}
