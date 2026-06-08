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
import { submissions } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

function MySubmissionsContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") ?? "";
  const [code, setCode] = useState(initialCode);
  const [searched, setSearched] = useState(!!initialCode);
  const [result, setResult] = useState(
    initialCode
      ? submissions.find(
          (s) => s.trackingCode.toUpperCase() === initialCode.toUpperCase()
        ) ?? null
      : null
  );

  const handleSearch = () => {
    setSearched(true);
    const found =
      submissions.find(
        (s) => s.trackingCode.toUpperCase() === code.toUpperCase()
      ) ?? findLocalSubmission(code);
    setResult(found ?? null);
  };

  function findLocalSubmission(trackingCode: string) {
    try {
      const stored: Array<{
        trackingCode: string;
        title: string;
        authors: string;
        affiliation: string;
        abstract: string;
        keywords: string;
        submittedAt: string;
      }> = JSON.parse(localStorage.getItem("paom-submissions") ?? "[]");

      const match = stored.find(
        (s) => s.trackingCode.toUpperCase() === trackingCode.toUpperCase()
      );
      if (!match) return null;

      return {
        id: match.trackingCode,
        trackingCode: match.trackingCode,
        title: match.title,
        authors: match.authors.split(",").map((a) => a.trim()),
        affiliation: match.affiliation,
        abstract: match.abstract,
        keywords: match.keywords.split(",").map((k) => k.trim()),
        status: "submitted" as const,
        submittedAt: match.submittedAt,
      };
    } catch {
      return null;
    }
  }

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
                  <span>
                    Keywords: {result.keywords.join(", ")}
                  </span>
                </div>
              </Card>
            ) : (
              <Card className="text-center">
                <p className="text-muted">
                  No submission found with tracking code &ldquo;{code}&rdquo;.
                  Please check the code and try again.
                </p>
                <p className="mt-2 text-xs text-muted">
                  Demo codes: PAOM-2026-A3F9K2, PAOM-2026-B7X2M1
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
