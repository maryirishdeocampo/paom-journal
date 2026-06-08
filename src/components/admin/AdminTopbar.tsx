"use client";

import { Bell, Menu, Search } from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface AdminTopbarProps {
  title: string;
  onMenuClick: () => void;
}

export function AdminTopbar({ title, onMenuClick }: AdminTopbarProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search..."
            className="h-10 w-48 rounded-xl border border-border bg-background pl-9 pr-3 text-sm focus:border-paom-blue focus:outline-none lg:w-64"
          />
        </div>
        <button
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <ThemeToggle />
        <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-paom-blue text-sm font-bold text-white sm:flex">
          A
        </div>
      </div>
    </header>
  );
}
