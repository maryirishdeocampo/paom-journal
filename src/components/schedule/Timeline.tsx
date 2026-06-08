"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Circle } from "lucide-react";
import type { ScheduleIssue } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { STATUS_LABELS } from "@/lib/constants";

interface TimelineProps {
  issues: ScheduleIssue[];
  showInternal?: boolean;
}

export function Timeline({ issues, showInternal = false }: TimelineProps) {
  const filtered = showInternal ? issues : issues.filter((i) => i.isPublic);

  return (
    <div className="relative space-y-0">
      {filtered.map((issue, index) => (
        <motion.div
          key={issue.id}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative flex gap-4 pb-8 last:pb-0"
        >
          {index < filtered.length - 1 && (
            <div className="absolute left-[15px] top-8 h-full w-0.5 bg-border" />
          )}
          <div className="relative z-10 mt-1">
            {issue.progress === 100 ? (
              <CheckCircle2 className="h-8 w-8 text-paom-red" />
            ) : (
              <Circle className="h-8 w-8 fill-card text-paom-blue" strokeWidth={2} />
            )}
          </div>
          <div className="flex-1 rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold">
                  Volume {issue.volume}, Issue {issue.issue}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-muted">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    Release: {formatDate(issue.releaseDate)}
                  </span>
                  <span>Deadline: {formatDate(issue.submissionDeadline)}</span>
                </div>
              </div>
              <StatusBadge variant={issue.status}>
                {STATUS_LABELS[issue.status] ?? issue.status}
              </StatusBadge>
            </div>
            <div className="mt-4">
              <ProgressBar value={issue.progress} />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
