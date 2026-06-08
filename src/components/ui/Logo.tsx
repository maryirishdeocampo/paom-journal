"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg" | "xl" | "hero" | "display";
  /** When false, renders without a link wrapper (for hero displays) */
  linked?: boolean;
}

/**
 * To use your PAoM logo, save it as: public/paom-logo.png
 * Recommended: PNG, 512×512, transparent background.
 */
const LOGO_PATH = withBasePath("/paom-logo.png");

const sizes = {
  sm: 32,
  md: 40,
  lg: 80,
  xl: 112,
  hero: 144,
  display: 280,
};

function LogoMark({ size = "md" }: { size?: keyof typeof sizes }) {
  const [imageFailed, setImageFailed] = useState(false);
  const px = sizes[size];

  if (imageFailed) {
    return (
      <div
        className="flex items-center justify-center rounded-xl bg-gradient-to-br from-paom-red via-paom-blue to-paom-gold shadow-sm"
        style={{ width: px, height: px }}
      >
        <span className="text-sm font-bold text-white">P</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden shadow-md",
        size === "display" || size === "hero" ? "rounded-2xl" : "rounded-xl"
      )}
      style={{ width: px, height: px }}
    >
      <Image
        src={LOGO_PATH}
        alt={`${BRAND.name} Logo`}
        width={px}
        height={px}
        className="object-contain"
        onError={() => setImageFailed(true)}
        unoptimized
      />
    </div>
  );
}

export function Logo({
  className,
  showText = true,
  href = "/",
  size = "md",
  linked = true,
}: LogoProps) {
  const content = (
    <>
      <LogoMark size={size} />
      {showText && (
        <div className="hidden max-w-[11rem] sm:block lg:max-w-none">
          <p className="text-xs font-bold leading-snug text-foreground lg:text-sm">
            {BRAND.name}
          </p>
        </div>
      )}
    </>
  );

  if (!linked) {
    return <div className={cn("flex items-center justify-center", className)}>{content}</div>;
  }

  return (
    <Link href={href} className={cn("flex items-center gap-3", className)}>
      {content}
    </Link>
  );
}
