"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  href?: string;
}

/**
 * To use your PAoM logo, save it as: public/paom-logo.png
 * Recommended: PNG, 512×512, transparent background.
 */
const LOGO_PATH = "/paom-logo.png";

function LogoMark() {
  const [imageFailed, setImageFailed] = useState(false);

  if (imageFailed) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-paom-red via-paom-blue to-paom-gold shadow-sm">
        <span className="text-sm font-bold text-white">P</span>
      </div>
    );
  }

  return (
    <div className="relative h-10 w-10 overflow-hidden rounded-xl shadow-sm">
      <Image
        src={LOGO_PATH}
        alt="PAoM Logo"
        width={40}
        height={40}
        className="object-contain"
        onError={() => setImageFailed(true)}
      />
    </div>
  );
}

export function Logo({ className, showText = true, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      {showText && (
        <div className="hidden sm:block">
          <p className="text-sm font-bold leading-tight text-foreground">PAoM</p>
          <p className="text-[10px] leading-tight text-muted">Journal System</p>
        </div>
      )}
    </Link>
  );
}
