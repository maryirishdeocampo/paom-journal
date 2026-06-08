"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ReviewerSuggestions } from "@/components/forms/ReviewerSuggestions";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { StatusBadge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { STATUS_LABELS } from "@/lib/constants";
import { submissions as mockSubmissions } from "@/lib/mock-data";
import { automateExistingSubmission } from "@/lib/submission-automation";
import type { Submission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type SubmissionRow = Submission & { suggestedReviewer?: string };

const columns: Column<SubmissionRow>[] = [
  {
    key: "trackingCode",
    header: "Code",
    render: (s) => <span className="font-mono text-xs">{s.trackingCode}</span>,
  },
  {
    key: "title",
    header: "Title",
    render: (s) => <span className="line-clamp-1 max-w-xs font-medium">{s.title}</span>,
  },
  {
    key: "authors",
    header: "Authors",
    render: (s) => s.authors.join(", "),
  },
  {
    key: "affiliation",
    header: "Affiliation",
    render: (s) => <span className="line-clamp-1 max-w-[150px]">{s.affiliation}</span>,
  },
  {
    key: "status",
    header: "Status",
    render: (s) => (
      <StatusBadge variant={s.status}>{STATUS_LABELS[s.status]}</StatusBadge>
    ),
  },
  {
    key: "submittedAt",
    header: "Submitted",
    render: (s) => formatDate(s.submittedAt),
  },
  {
    key: "email",
    header: "Email",
    render: (s) => <span className="text-xs">{s.email}</span>,
  },
  {
    key: "suggestedReviewer",
    header: "Suggested Reviewer",
    render: (s) => (
      <span className="text-xs font-medium text-paom-blue">
        {s.suggestedReviewer ?? "—"}
      </span>
    ),
  },
];

function loadAllSubmissions(): SubmissionRow[] {
  const rows: SubmissionRow[] = mockSubmissions.map((s) => {
    const auto = automateExistingSubmission(s);
    return {
      ...s,
      suggestedReviewer: auto.suggestedReviewers[0]?.reviewer.name,
    };
  });

  try {
    const stored: Array<{
      trackingCode: string;
      title: string;
      authors: string;
      affiliation: string;
      abstract: string;
      keywords: string;
      email: string;
      submittedAt: string;
      suggestedReviewers?: Array<{ name: string }>;
    }> = JSON.parse(localStorage.getItem("paom-submissions") ?? "[]");

    for (const item of stored) {
      if (rows.some((r) => r.trackingCode === item.trackingCode)) continue;
      const auto = automateExistingSubmission({
        id: item.trackingCode,
        trackingCode: item.trackingCode,
        title: item.title,
        authors: item.authors.split(",").map((a) => a.trim()),
        affiliation: item.affiliation,
        abstract: item.abstract,
        keywords: item.keywords.split(",").map((k) => k.trim()),
        status: "submitted",
        submittedAt: item.submittedAt,
        email: item.email,
      });
      rows.unshift({
        id: item.trackingCode,
        trackingCode: item.trackingCode,
        title: item.title,
        authors: item.authors.split(",").map((a) => a.trim()),
        affiliation: item.affiliation,
        abstract: item.abstract,
        keywords: item.keywords.split(",").map((k) => k.trim()),
        status: "submitted",
        submittedAt: item.submittedAt,
        email: item.email,
        suggestedReviewer:
          item.suggestedReviewers?.[0]?.name ??
          auto.suggestedReviewers[0]?.reviewer.name,
      });
    }
  } catch {
    // ignore
  }

  return rows;
}

export default function AdminSubmissionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [allSubmissions, setAllSubmissions] = useState<SubmissionRow[]>([]);
  const [selected, setSelected] = useState<SubmissionRow | null>(null);
  const [automation, setAutomation] = useState(
    automateExistingSubmission(mockSubmissions[0])
  );

  useEffect(() => {
    setAllSubmissions(loadAllSubmissions());
  }, []);

  const filtered = useMemo(() => {
    return allSubmissions.filter((s) => {
      const matchesSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
        s.authors.some((a) => a.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = status === "all" || s.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status, allSubmissions]);

  const selectSubmission = (row: SubmissionRow) => {
    setSelected(row);
    setAutomation(automateExistingSubmission(row));
  };

  return (
    <AdminShell title="Submissions">
      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search submissions..."
        className="mb-6"
        filters={
          <SelectFilter
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All Status" },
              ...Object.entries(STATUS_LABELS).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
        }
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable
            data={filtered}
            columns={[
              ...columns,
              {
                key: "actions",
                header: "",
                render: (s) => (
                  <button
                    type="button"
                    onClick={() => selectSubmission(s)}
                    className="text-xs font-medium text-paom-blue hover:underline"
                  >
                    View match
                  </button>
                ),
              },
            ]}
            pageSize={10}
          />
        </div>
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Reviewer Automation</CardTitle>
          </CardHeader>
          {selected ? (
            <div className="space-y-3">
              <p className="text-sm font-medium line-clamp-2">{selected.title}</p>
              <p className="font-mono text-xs text-muted">{selected.trackingCode}</p>
              <ReviewerSuggestions
                suggestions={automation.suggestedReviewers}
                extractedKeywords={automation.keywords}
              />
            </div>
          ) : (
            <p className="text-sm text-muted">
              Click &ldquo;View match&rdquo; on a submission to see auto-extracted
              keywords and suggested reviewers.
            </p>
          )}
        </Card>
      </div>
    </AdminShell>
  );
}
