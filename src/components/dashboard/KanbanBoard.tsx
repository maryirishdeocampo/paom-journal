"use client";

import { motion } from "framer-motion";
import type { Manuscript, ManuscriptStatus } from "@/lib/types";
import { KANBAN_COLUMNS, STATUS_LABELS } from "@/lib/constants";
import { StatusBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

interface KanbanBoardProps {
  manuscripts: Manuscript[];
}

export function KanbanBoard({ manuscripts }: KanbanBoardProps) {
  const columns = KANBAN_COLUMNS.map((status) => ({
    status,
    label: STATUS_LABELS[status],
    items: manuscripts.filter((m) => m.status === status),
  }));

  return (
    <div className="flex gap-3 overflow-x-auto pb-2">
      {columns.map((col) => (
        <div key={col.status} className="min-w-[200px] flex-1">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-xs font-semibold">{col.label}</h3>
            <span className="rounded-full bg-background px-2 py-0.5 text-[10px] text-muted">
              {col.items.length}
            </span>
          </div>
          <div className="min-h-[180px] space-y-2 rounded-xl bg-background/50 p-2">
            {col.items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="rounded-xl border border-border bg-card p-2.5 shadow-sm"
              >
                <p className="font-mono text-[10px] text-muted">{item.manuscriptId}</p>
                <p className="mt-0.5 text-xs font-medium leading-snug line-clamp-2">
                  {item.title}
                </p>
                <p className="mt-1 text-[10px] text-muted">{item.authors[0]}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <StatusBadge variant={item.status as ManuscriptStatus}>
                    {STATUS_LABELS[item.status]}
                  </StatusBadge>
                  <span className="text-[9px] text-muted">
                    {formatDate(item.submittedAt)}
                  </span>
                </div>
              </motion.div>
            ))}
            {col.items.length === 0 && (
              <p className="py-6 text-center text-[10px] text-muted">Empty</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
