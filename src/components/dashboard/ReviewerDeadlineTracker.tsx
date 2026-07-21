"use client";

import { AlertCircle, Clock } from "lucide-react";
import type { Manuscript, Reviewer } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";

interface ReviewerDeadlineTrackerProps {
  reviewers: Reviewer[];
  manuscripts: Manuscript[];
}

export function ReviewerDeadlineTracker({
  reviewers,
  manuscripts,
}: ReviewerDeadlineTrackerProps) {
  const reviewerById = new Map(reviewers.map((reviewer) => [reviewer.id, reviewer]));
  const withDeadlines = manuscripts
    .flatMap((manuscript) =>
      manuscript.reviewAssignments.map((assignment) => ({
        manuscript,
        assignment,
        reviewer: reviewerById.get(assignment.reviewerId),
      }))
    )
    .filter(
      (item) => item.reviewer && item.assignment.status !== "completed"
    )
    .sort((a, b) => {
      const aDate = new Date(a.assignment.responseDeadline).getTime();
      const bDate = new Date(b.assignment.responseDeadline).getTime();
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
        {withDeadlines.map(({ reviewer, manuscript, assignment }) => {
          if (!reviewer) return null;
          const targetDate = assignment.responseDeadline;
          const daysLeft = Math.ceil(
            (new Date(targetDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          );
          const urgent = daysLeft <= 7;

          return (
            <div
              key={`${manuscript.id}-${reviewer.id}`}
              className="flex items-center justify-between rounded-xl border border-border bg-background/50 p-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{reviewer.name}</p>
                <p className="text-xs text-muted">
                  {manuscript.manuscriptId}
                </p>
                <p className="mt-1 text-xs">
                  Response due: {formatDate(assignment.responseDeadline)}
                </p>
                <p className="text-xs text-muted">
                  Follow-up: {formatDate(assignment.followUpDate)}
                </p>
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
