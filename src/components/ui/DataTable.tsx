"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  className?: string;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  pageSize = 10,
  className,
  emptyMessage = "No results found.",
}: DataTableProps<T>) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / pageSize);
  const paginated = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <div className={cn("overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background/50">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-muted">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-border/50 transition-colors last:border-0 hover:bg-background/50"
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render(item)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="text-xs text-muted">
            Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, data.length)} of{" "}
            {data.length}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
