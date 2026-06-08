"use client";

import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PUBLIC_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {PUBLIC_NAV.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-paom-blue/10 text-paom-blue"
                  : "text-muted hover:bg-card hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle className="hidden sm:flex" />
          <Button href="/submit" size="sm" className="hidden sm:inline-flex">
            Submit Journal
          </Button>
          <Link
            href="/admin/login"
            className="hidden rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-foreground lg:block"
          >
            Admin Login
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-border bg-background px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {PUBLIC_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium",
                  pathname === link.href
                    ? "bg-paom-blue/10 text-paom-blue"
                    : "text-muted hover:bg-card"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-muted"
            >
              Admin Login
            </Link>
            <Button href="/submit" className="mt-2">
              Submit Journal
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
