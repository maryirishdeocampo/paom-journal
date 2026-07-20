"use client";

import { AlertCircle, Clock } from "lucide-react";
import type { Reviewer } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";

interface ReviewerDeadlineTrackerProps {
  reviewers: Reviewer[];
}

export function ReviewerDeadlineTracker({ reviewers }: ReviewerDeadlineTrackerProps) {
  const withDeadlines = reviewers
    .filter((r) => (r.deadline || r.followUpDate) && r.activeReviews > 0)
    .sort((a, b) => {
      const aDate = new Date(a.deadline ?? a.followUpDate ?? 0).getTime();
      const bDate = new Date(b.deadline ?? b.followUpDate ?? 0).getTime();
      return aDate - bDate;
    });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-paom-blue" />
          Reviewer Deadlines
        </CardTitle>
      </CardHeader>
      <div className="space-y-3">
        {withDeadlines.map((reviewer) => {
          const targetDate = reviewer.deadline ?? reviewer.followUpDate!;
          const daysLeft = Math.ceil(
            (new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          const urgent = daysLeft <= 7;

          return (
            <div
              key={reviewer.id}
              className="flex items-center justify-between rounded-xl border border-border bg-background/50 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{reviewer.name}</p>
                <p className="text-xs text-muted">
                  {reviewer.activeReviews} active review
                  {reviewer.activeReviews !== 1 ? "s" : ""}
                </p>
                {reviewer.deadline && (
                  <p className="mt-1 text-xs">
                    Deadline: {formatDate(reviewer.deadline)}
                  </p>
                )}
                {reviewer.followUpDate && (
                  <p className="text-xs text-muted">
                    Follow-up: {formatDate(reviewer.followUpDate)}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {urgent && <AlertCircle className="h-4 w-4 text-paom-red" />}
                <div className="text-right">
                  <StatusBadge variant={urgent ? "revision_required" : "available"}>
                    {daysLeft > 0 ? `${daysLeft}d left` : "Overdue"}
                  </StatusBadge>
                </div>
              </div>
            </div>
          );
        })}
        {withDeadlines.length === 0 && (
          <p className="py-4 text-center text-sm text-muted">No upcoming deadlines.</p>
        )}
      </div>
    </Card>
  );
}
