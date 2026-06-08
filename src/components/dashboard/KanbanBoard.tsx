"use client";

import { motion } from "framer-motion";
import type { Submission, SubmissionStatus } from "@/lib/types";
import { KANBAN_COLUMNS, STATUS_LABELS } from "@/lib/constants";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface KanbanBoardProps {
  submissions: Submission[];
}

export function KanbanBoard({ submissions }: KanbanBoardProps) {
  const columns = KANBAN_COLUMNS.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    items: submissions.filter((s) => s.status === status),
  }));

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {columns.map((col) => (
        <div key={col.status} className="min-w-[240px] flex-1">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{col.label}</h3>
            <span className="rounded-full bg-background px-2 py-0.5 text-xs text-muted">
              {col.items.length}
            </span>
          </div>
          <div className="space-y-3 rounded-xl bg-background/50 p-2 min-h-[200px]">
            {col.items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-border bg-card p-3 shadow-sm transition-shadow hover:shadow-card"
              >
                <p className="text-xs font-mono text-muted">{item.trackingCode}</p>
                <p className="mt-1 text-sm font-medium leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="mt-1 text-xs text-muted">{item.authors[0]}</p>
                <div className="mt-2 flex items-center justify-between">
                  <StatusBadge variant={item.status as SubmissionStatus}>
                    {STATUS_LABELS[item.status]}
                  </StatusBadge>
                  <span className="text-[10px] text-muted">
                    {formatDate(item.submittedAt)}
                  </span>
                </div>
              </motion.div>
            ))}
            {col.items.length === 0 && (
              <p className="py-8 text-center text-xs text-muted">No items</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
