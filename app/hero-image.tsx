"use client";

import Image from "next/image";
import { useState } from "react";

export function HeroImage({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`${className} transition-opacity duration-700 ease-out ${
        isLoaded ? "opacity-100" : "opacity-0"
      }`}
      priority
      onLoad={() => setIsLoaded(true)}
    />
  );
}
