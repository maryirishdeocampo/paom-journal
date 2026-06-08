import Link from "next/link";
import { BRAND, PUBLIC_NAV } from "@/lib/constants";
import { Logo } from "@/components/ui/Logo";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Logo showText />
            <p className="mt-4 text-sm text-muted">
              {BRAND.tagline}. Advancing management research and scholarly publication
              across the Philippines.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {PUBLIC_NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Contact</h4>
            <p className="text-sm text-muted">
              Philippine Academy of Management
              <br />
              journal@paom.org.ph
              <br />
              Metro Manila, Philippines
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 text-center text-xs text-muted">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
