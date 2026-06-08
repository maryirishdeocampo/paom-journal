"use client";

import Image from "next/image";
import { useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

/**
 * Landscape hero logo — save as: public/paom-logo-landscape.png
 * Recommended: PNG, ~800×200 to 1200×300, transparent background.
 * Falls back to square paom-logo.png if landscape file is missing.
 */
const LANDSCAPE_LOGO = withBasePath("/paom-logo-landscape.png");
const SQUARE_LOGO = withBasePath("/paom-logo.png");

interface HeroLogoProps {
  className?: string;
}

export function HeroLogo({ className }: HeroLogoProps) {
  const [useLandscape, setUseLandscape] = useState(true);
  const [squareFailed, setSquareFailed] = useState(false);

  if (squareFailed) {
    return (
      <div
        className={cn(
          "flex h-24 w-full max-w-xl items-center justify-center rounded-2xl bg-gradient-to-r from-paom-red via-paom-blue to-paom-gold shadow-lg sm:h-32",
          className
        )}
      >
        <span className="text-2xl font-bold text-white sm:text-3xl">PAoM</span>
      </div>
    );
  }

  if (useLandscape) {
    return (
      <div className={cn("relative w-full max-w-2xl sm:max-w-3xl lg:max-w-4xl", className)}>
        <Image
          src={LANDSCAPE_LOGO}
          alt={`${BRAND.name} Logo`}
          width={960}
          height={280}
          className="h-auto w-full object-contain drop-shadow-md"
          priority
          unoptimized
          onError={() => setUseLandscape(false)}
        />
      </div>
    );
  }

  return (
    <div className={cn("flex justify-center", className)}>
      <Image
        src={SQUARE_LOGO}
        alt={`${BRAND.name} Logo`}
        width={200}
        height={200}
        className="h-40 w-40 object-contain drop-shadow-md sm:h-52 sm:w-52"
        priority
        unoptimized
        onError={() => setSquareFailed(true)}
      />
    </div>
  );
}
