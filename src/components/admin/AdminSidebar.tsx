"use client";

import {
  BarChart3,
  BookOpen,
  Calendar,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ADMIN_NAV } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";

const iconMap = {
  LayoutDashboard,
  FileText,
  Users,
  Calendar,
  BookOpen,
  BarChart3,
  Settings,
};

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    document.cookie = "paom-admin=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const nav = (
    <>
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <Logo href="/admin" />
        <button onClick={onClose} className="lg:hidden" aria-label="Close sidebar">
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {ADMIN_NAV.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-paom-blue text-white"
                  : "text-muted hover:bg-background hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-4 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          View Public Site
        </Link>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-red-50 hover:text-paom-red dark:hover:bg-red-900/20"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {nav}
      </aside>
    </>
  );
}
