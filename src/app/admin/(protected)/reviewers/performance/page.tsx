"use client";

import { useMemo } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { useStore } from "@/hooks/useStore";
import { getManuscripts } from "@/lib/store";

export default function ReviewerPerformancePage() {
  const { reviewers } = useStore();
  const manuscripts = getManuscripts();

  const stats = useMemo(() => {
    return reviewers.map((r) => {
      const assigned = manuscripts.filter((m) =>
        m.assignedReviewerIds.includes(r.id)
      );
      const completed = assigned.filter((m) =>
        ["accepted", "scheduled", "published", "archived"].includes(m.status)
      );
      const active = assigned.filter((m) =>
        ["under_review", "revision_required"].includes(m.status)
      );
      return { reviewer: r, assigned: assigned.length, completed: completed.length, active: active.length };
    });
  }, [reviewers, manuscripts]);

  return (
    <AdminShell title="Reviewer Performance">
      <p className="mb-6 text-sm text-muted">
        Reviewer workload and completion metrics derived from manuscript workflow data.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map(({ reviewer, assigned, completed, active }) => (
          <Card key={reviewer.id} hover>
            <h3 className="font-semibold">{reviewer.name}</h3>
            <p className="text-xs text-muted">{reviewer.affiliation}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge variant="available">{assigned} assigned</StatusBadge>
              <StatusBadge variant="under_review">{active} active</StatusBadge>
              <StatusBadge variant="accepted">{completed} completed</StatusBadge>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-paom-blue"
                style={{
                  width: assigned ? `${(completed / assigned) * 100}%` : "0%",
                }}
              />
            </div>
            <p className="mt-1 text-xs text-muted">
              {assigned ? Math.round((completed / assigned) * 100) : 0}% completion rate
            </p>
          </Card>
        ))}
      </div>
    </AdminShell>
  );
}
