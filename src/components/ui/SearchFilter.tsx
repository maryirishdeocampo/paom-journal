"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filters?: React.ReactNode;
  className?: string;
}

export function SearchFilter({
  search,
  onSearchChange,
  placeholder = "Search...",
  filters,
  className,
}: SearchFilterProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={placeholder}
          className="h-11 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm focus:border-paom-blue focus:outline-none focus:ring-2 focus:ring-paom-blue/20"
        />
      </div>
      {filters && (
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-muted sm:hidden" />
          {filters}
        </div>
      )}
    </div>
  );
}

interface SelectFilterProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function SelectFilter({ label, value, onChange, options }: SelectFilterProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
      className="h-11 rounded-xl border border-border bg-card px-3 text-sm focus:border-paom-blue focus:outline-none focus:ring-2 focus:ring-paom-blue/20"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
