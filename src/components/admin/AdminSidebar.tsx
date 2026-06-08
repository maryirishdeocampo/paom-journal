"use client";

import {
  BarChart3,
  BookOpen,
  Calendar,
  ChevronDown,
  ExternalLink,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { ADMIN_NAV, type AdminNavItem } from "@/lib/constants";
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

function SidebarNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    Manuscripts: true,
    Reviewers: false,
    "Issues & Schedule": false,
  });

  const toggle = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  const isChildActive = (item: AdminNavItem) => {
    if (!item.children) return false;
    return item.children.some((child) => {
      if (child.href.includes("?")) {
        const [path, query] = child.href.split("?");
        const status = new URLSearchParams(query).get("status");
        return pathname === path && currentStatus === status;
      }
      return pathname === child.href || pathname.startsWith(child.href + "/");
    });
  };

  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-4">
      {ADMIN_NAV.map((item) => {
        const Icon = item.icon
          ? iconMap[item.icon as keyof typeof iconMap]
          : null;

        if (item.children) {
          const open = expanded[item.label] ?? isChildActive(item);
          return (
            <div key={item.label}>
              <button
                type="button"
                onClick={() => toggle(item.label)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isChildActive(item)
                    ? "text-paom-blue"
                    : "text-muted hover:bg-background hover:text-foreground"
                )}
              >
                <span className="flex items-center gap-3">
                  {Icon && <Icon className="h-4 w-4" />}
                  {item.label}
                </span>
                <ChevronDown
                  className={cn("h-4 w-4 transition-transform", open && "rotate-180")}
                />
              </button>
              {open && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-border pl-3">
                  {item.children.map((child) => {
                    const [childPath] = child.href.split("?");
                    const childStatus = child.href.includes("status=")
                      ? child.href.split("status=")[1]
                      : null;
                    const active =
                      childStatus
                        ? pathname === childPath && currentStatus === childStatus
                        : pathname === child.href ||
                          (child.href !== "/admin/manuscripts" &&
                            pathname.startsWith(child.href));

                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={onClose}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                          active
                            ? "bg-paom-blue text-white"
                            : "text-muted hover:bg-background hover:text-foreground"
                        )}
                      >
                        {child.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        }

        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname.startsWith(item.href!);

        return (
          <Link
            key={item.href}
            href={item.href!}
            onClick={onClose}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-paom-blue text-white"
                : "text-muted hover:bg-background hover:text-foreground"
            )}
          >
            {Icon && <Icon className="h-4 w-4" />}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const router = useRouter();

  const logout = () => {
    document.cookie = "paom-admin=; path=/; max-age=0";
    router.push("/admin/login");
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Logo href="/admin" />
          <button onClick={onClose} className="lg:hidden" aria-label="Close sidebar">
            <X className="h-5 w-5" />
          </button>
        </div>

        <Suspense>
          <SidebarNav onClose={onClose} />
        </Suspense>

        <div className="space-y-1 border-t border-border p-4">
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
      </aside>
    </>
  );
}
