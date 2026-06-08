"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PageTransition } from "@/components/public/PageTransition";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import {
  REVIEW_DECISION_LABELS,
  REVIEW_STATUS_LABELS,
  STATUS_LABELS,
} from "@/lib/constants";
import { getManuscriptByCode } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import type { Manuscript } from "@/lib/types";

function MySubmissionsContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") ?? "";
  const [code, setCode] = useState(initialCode);
  const [searched, setSearched] = useState(!!initialCode);
  const [result, setResult] = useState<Manuscript | null | undefined>(
    initialCode ? getManuscriptByCode(initialCode) ?? null : null
  );

  const handleSearch = () => {
    setSearched(true);
    setResult(getManuscriptByCode(code) ?? null);
  };

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">My Submissions</h1>
          <p className="mt-2 text-muted">
            Enter your tracking code to check the status of your manuscript.
          </p>
        </div>

        <Card>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="tracking-code"
              placeholder="e.g. PAOM-2026-A3F9K2"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch} className="shrink-0">
              <Search className="h-4 w-4" />
              Track
            </Button>
          </div>
        </Card>

        {searched && (
          <div className="mt-6">
            {result ? (
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <CardTitle className="text-base font-mono text-muted">
                      {result.trackingCode}
                    </CardTitle>
                    <StatusBadge variant={result.status}>
                      {STATUS_LABELS[result.status]}
                    </StatusBadge>
                  </div>
                </CardHeader>
                <h2 className="text-lg font-semibold">{result.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {result.authors.join(", ")} · {result.affiliation}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-muted">
                  {result.abstract}
                </p>
                <div className="mt-4 flex flex-wrap gap-4 border-t border-border pt-4 text-sm text-muted">
                  <span>Submitted: {formatDate(result.submittedAt)}</span>
                  <span>Last Updated: {formatDate(result.updatedAt)}</span>
                  <span>Keywords: {result.keywords.join(", ")}</span>
                </div>

                {(result.editorialDecision || result.reviewAssignments.length > 0) && (
                  <div className="mt-5 space-y-3 border-t border-border pt-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-medium">Latest Review Decision:</span>
                      {result.editorialDecision ? (
                        <StatusBadge variant={result.editorialDecision}>
                          {REVIEW_DECISION_LABELS[result.editorialDecision]}
                        </StatusBadge>
                      ) : (
                        <span className="text-sm text-muted">Awaiting editorial decision</span>
                      )}
                    </div>

                    {result.reviewAssignments.length > 0 && (
                      <div className="space-y-3">
                        {result.reviewAssignments.map((assignment, index) => (
                          <div
                            key={`${result.id}-${assignment.reviewerId}-${index}`}
                            className="rounded-xl border border-border bg-background/60 p-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <p className="text-sm font-medium">Reviewer {index + 1}</p>
                              <StatusBadge variant={assignment.status}>
                                {REVIEW_STATUS_LABELS[assignment.status]}
                              </StatusBadge>
                            </div>

                            <div className="mt-2 flex flex-wrap gap-2">
                              {assignment.decision ? (
                                <StatusBadge variant={assignment.decision}>
                                  {REVIEW_DECISION_LABELS[assignment.decision]}
                                </StatusBadge>
                              ) : (
                                <span className="text-xs text-muted">
                                  No decision submitted yet
                                </span>
                              )}
                            </div>

                            <p className="mt-3 text-sm leading-relaxed text-muted">
                              {assignment.remarks || "No reviewer remarks have been posted yet."}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Card>
            ) : (
              <Card className="text-center">
                <p className="text-muted">
                  No submission found with tracking code &ldquo;{code}&rdquo;.
                  Please check the code and try again.
                </p>
              </Card>
            )}
          </div>
        )}
      </div>
    </PageTransition>
  );
}

export default function MySubmissionsPage() {
  return (
    <Suspense>
      <MySubmissionsContent />
    </Suspense>
  );
}
