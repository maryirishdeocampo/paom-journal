"use client";

import { Mail } from "lucide-react";
import type { Reviewer } from "@/lib/types";
import { getInitials } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";

interface ReviewerCardProps {
  reviewer: Reviewer;
  showWorkload?: boolean;
}

export function ReviewerCard({ reviewer, showWorkload = false }: ReviewerCardProps) {
  return (
    <Card hover>
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-paom-blue/20 to-paom-red/20 text-lg font-bold text-paom-blue">
          {getInitials(reviewer.name)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{reviewer.name}</h3>
              <p className="text-sm text-muted">{reviewer.affiliation}</p>
            </div>
            <StatusBadge variant={reviewer.availability}>
              {reviewer.availability}
            </StatusBadge>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {reviewer.expertise.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-background px-2 py-0.5 text-xs text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
          {showWorkload && (
            <p className="mt-2 text-xs text-muted">
              {reviewer.activeReviews} active review
              {reviewer.activeReviews !== 1 ? "s" : ""}
              {reviewer.deadline && ` · Next deadline: ${reviewer.deadline}`}
            </p>
          )}
          {!showWorkload && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted">
              <Mail className="h-3 w-3" />
              Editorial Board Member
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
