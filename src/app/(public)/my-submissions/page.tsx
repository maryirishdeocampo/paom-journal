"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PageTransition } from "@/components/public/PageTransition";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import { STATUS_LABELS } from "@/lib/constants";
import { getSubmissionByCode } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import type { Submission } from "@/lib/types";

function MySubmissionsContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") ?? "";
  const [code, setCode] = useState(initialCode);
  const [searched, setSearched] = useState(!!initialCode);
  const [result, setResult] = useState<Submission | null | undefined>(
    initialCode ? getSubmissionByCode(initialCode) ?? null : null
  );

  const handleSearch = () => {
    setSearched(true);
    setResult(getSubmissionByCode(code) ?? null);
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
                  <span>Keywords: {result.keywords.join(", ")}</span>
                </div>
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
