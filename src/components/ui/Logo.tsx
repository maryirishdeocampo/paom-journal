import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showText?: boolean;
  href?: string;
}

export function Logo({ className, showText = true, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("flex items-center gap-3", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-paom-red via-paom-blue to-paom-gold shadow-sm">
        <span className="text-sm font-bold text-white">P</span>
      </div>
      {showText && (
        <div className="hidden sm:block">
          <p className="text-sm font-bold leading-tight text-foreground">PAoM</p>
          <p className="text-[10px] leading-tight text-muted">Journal System</p>
        </div>
      )}
    </Link>
  );
}
