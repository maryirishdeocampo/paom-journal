"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { withBasePath } from "@/lib/base-path";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  href?: string;
  size?: "sm" | "md" | "lg";
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
};

function LogoMark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
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
      className="relative overflow-hidden rounded-xl shadow-sm"
      style={{ width: px, height: px }}
    >
      <Image
        src={LOGO_PATH}
        alt="PAoM Logo"
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
}: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-3", className)}>
      <LogoMark size={size} />
      {showText && (
        <div className="hidden sm:block">
          <p className="text-sm font-bold leading-tight text-foreground">PAoM</p>
          <p className="text-[10px] leading-tight text-muted">Journal System</p>
        </div>
      )}
    </Link>
  );
}
