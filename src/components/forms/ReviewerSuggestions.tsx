"use client";

import type { ReviewerSuggestion } from "@/lib/reviewer-matching";
import { getInitials } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

interface ReviewerSuggestionsProps {
  suggestions: ReviewerSuggestion[];
  extractedKeywords: string[];
}

export function ReviewerSuggestions({
  suggestions,
  extractedKeywords,
}: ReviewerSuggestionsProps) {
  return (
    <div className="space-y-4 text-left">
      {extractedKeywords.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted">Auto-extracted keywords</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {extractedKeywords.map((kw) => (
              <span
                key={kw}
                className="rounded-lg bg-paom-blue/10 px-2 py-0.5 text-xs text-paom-blue"
              >
                {kw}
              </span>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-muted">Suggested reviewers</p>
        {suggestions.length === 0 ? (
          <p className="mt-2 text-sm text-muted">
            No strong matches found. An editor will assign a reviewer manually.
          </p>
        ) : (
          <ul className="mt-2 space-y-2">
            {suggestions.map(({ reviewer, matchedExpertise, reason }, i) => (
              <li
                key={reviewer.id}
                className="flex items-start gap-3 rounded-xl border border-border bg-background p-3"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-paom-blue/10 text-sm font-bold text-paom-blue">
                  {getInitials(reviewer.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium">{reviewer.name}</p>
                    <span className="text-xs text-muted">#{i + 1}</span>
                    <StatusBadge variant={reviewer.availability}>
                      {reviewer.availability}
                    </StatusBadge>
                  </div>
                  <p className="text-xs text-muted">{reviewer.affiliation}</p>
                  {matchedExpertise.length > 0 && (
                    <p className="mt-1 text-xs text-paom-blue">{reason}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
