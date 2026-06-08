"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ManuscriptViewer } from "@/components/admin/ManuscriptViewer";
import { SubmissionEditor } from "@/components/admin/SubmissionEditor";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { StatusBadge } from "@/components/ui/Badge";
import { STATUS_LABELS } from "@/lib/constants";
import { automateExistingSubmission } from "@/lib/submission-automation";
import { getReviewerById } from "@/lib/store";
import { useStore } from "@/hooks/useStore";
import type { Submission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function AdminSubmissionsPage() {
  const { submissions, reviewers, refresh } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Submission | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    if (selected) {
      const updated = submissions.find((s) => s.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [submissions, selected]);

  const enriched = useMemo(
    () =>
      submissions.map((s) => ({
        ...s,
        reviewerName: s.reviewerId ? getReviewerById(s.reviewerId)?.name : undefined,
        suggestedName:
          automateExistingSubmission(s).suggestedReviewers[0]?.reviewer.name,
      })),
    [submissions]
  );

  const filtered = useMemo(() => {
    return enriched.filter((s) => {
      const matchesSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
        s.authors.some((a) => a.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = statusFilter === "all" || s.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [enriched, search, statusFilter]);

  const columns: Column<(typeof enriched)[0]>[] = [
    {
      key: "trackingCode",
      header: "Code",
      render: (s) => <span className="font-mono text-xs">{s.trackingCode}</span>,
    },
    {
      key: "title",
      header: "Title",
      render: (s) => (
        <button
          type="button"
          onClick={() => setSelected(s)}
          className="line-clamp-1 max-w-xs text-left font-medium text-paom-blue hover:underline"
        >
          {s.title}
        </button>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (s) => (
        <StatusBadge variant={s.status}>{STATUS_LABELS[s.status]}</StatusBadge>
      ),
    },
    {
      key: "reviewer",
      header: "Reviewer",
      render: (s) => (
        <span className="text-xs">{s.reviewerName ?? s.suggestedName ?? "—"}</span>
      ),
    },
    {
      key: "file",
      header: "File",
      render: (s) => (
        <span className="text-xs">{s.manuscript ? "📄 Yes" : "—"}</span>
      ),
    },
    {
      key: "submittedAt",
      header: "Submitted",
      render: (s) => formatDate(s.submittedAt),
    },
  ];

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
            value={statusFilter}
            onChange={setStatusFilter}
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
          <DataTable data={filtered} columns={columns} pageSize={10} />
        </div>
        <SubmissionEditor
          submission={selected}
          reviewers={reviewers.map((r) => ({ id: r.id, name: r.name }))}
          onViewManuscript={() => setViewerOpen(true)}
          onSaved={refresh}
        />
      </div>
      <ManuscriptViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        manuscript={selected?.manuscript}
        title={selected?.title}
      />
    </AdminShell>
  );
}
