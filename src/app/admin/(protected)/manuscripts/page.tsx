"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ManuscriptEditor } from "@/components/admin/ManuscriptEditor";
import { ManuscriptViewer } from "@/components/admin/ManuscriptViewer";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { StatusBadge } from "@/components/ui/Badge";
import { REVIEW_STATUS_LABELS, RESEARCH_AREAS, STATUS_LABELS } from "@/lib/constants";
import { formatIssueLabel, getCorrespondingAuthor } from "@/lib/manuscript-utils";
import { getIssueById, getReviewerById } from "@/lib/store";
import { useStore } from "@/hooks/useStore";
import type { Manuscript } from "@/lib/types";
import { formatDate } from "@/lib/utils";

function ManuscriptsContent() {
  const searchParams = useSearchParams();
  const queueStatus = searchParams.get("status") ?? "all";
  const { manuscripts, reviewers, issues, refresh } = useStore();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(queueStatus);
  const [dateFilter, setDateFilter] = useState("all");
  const [issueFilter, setIssueFilter] = useState("all");
  const [reviewerFilter, setReviewerFilter] = useState("all");
  const [areaFilter, setAreaFilter] = useState("all");
  const [selected, setSelected] = useState<Manuscript | null>(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  useEffect(() => {
    setStatusFilter(queueStatus);
  }, [queueStatus]);

  useEffect(() => {
    if (selected) {
      const updated = manuscripts.find((m) => m.id === selected.id);
      if (updated) setSelected(updated);
    }
  }, [manuscripts, selected]);

  const pageTitle =
    statusFilter !== "all"
      ? STATUS_LABELS[statusFilter] ?? "Manuscripts"
      : "All Manuscripts";

  const filtered = useMemo(() => {
    const now = new Date();
    return manuscripts.filter((m) => {
      const matchesSearch =
        !search ||
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.manuscriptId.toLowerCase().includes(search.toLowerCase()) ||
        m.authors.some((a) => a.toLowerCase().includes(search.toLowerCase())) ||
        m.affiliation.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === "all" || m.status === statusFilter;

      const matchesDate =
        dateFilter === "all" ||
        (dateFilter === "30d" &&
          now.getTime() - new Date(m.submittedAt).getTime() < 30 * 86400000) ||
        (dateFilter === "90d" &&
          now.getTime() - new Date(m.submittedAt).getTime() < 90 * 86400000) ||
        (dateFilter === "year" &&
          new Date(m.submittedAt).getFullYear() === now.getFullYear());

      const matchesIssue =
        issueFilter === "all" ||
        (issueFilter === "none" && !m.issueId) ||
        m.issueId === issueFilter;

      const matchesReviewer =
        reviewerFilter === "all" ||
        (reviewerFilter === "none" && m.reviewAssignments.length === 0) ||
        m.reviewAssignments.some((assignment) => assignment.reviewerId === reviewerFilter);

      const matchesArea = areaFilter === "all" || m.researchArea === areaFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDate &&
        matchesIssue &&
        matchesReviewer &&
        matchesArea
      );
    });
  }, [
    manuscripts,
    search,
    statusFilter,
    dateFilter,
    issueFilter,
    reviewerFilter,
    areaFilter,
  ]);

  const columns: Column<Manuscript>[] = [
    {
      key: "manuscriptId",
      header: "Manuscript ID",
      render: (m) => (
        <button
          type="button"
          onClick={() => setSelected(m)}
          className="font-mono text-xs text-paom-blue hover:underline"
        >
          {m.manuscriptId}
        </button>
      ),
    },
    {
      key: "submittedAt",
      header: "Submission Date",
      render: (m) => formatDate(m.submittedAt),
    },
    {
      key: "title",
      header: "Title",
      render: (m) => (
        <span className="line-clamp-1 max-w-[200px] font-medium">{m.title}</span>
      ),
    },
    {
      key: "author",
      header: "Corresponding Author",
      render: (m) => getCorrespondingAuthor(m),
    },
    {
      key: "affiliation",
      header: "Institution",
      render: (m) => (
        <span className="line-clamp-1 max-w-[140px] text-xs">{m.affiliation}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (m) => (
        <StatusBadge variant={m.status}>{STATUS_LABELS[m.status]}</StatusBadge>
      ),
    },
    {
      key: "reviewers",
      header: "Assigned Reviewers",
      render: (m) => (
        <div className="space-y-1 text-xs">
          {m.reviewAssignments.length ? (
            m.reviewAssignments.map((assignment, index) => (
              <div key={`${m.id}-${assignment.reviewerId}`} className="leading-tight">
                <span className="font-medium">
                  Reviewer {index + 1}:{" "}
                  {getReviewerById(assignment.reviewerId)?.name?.split(" ").pop() ?? "—"}
                </span>
                <span className="text-muted"> · {REVIEW_STATUS_LABELS[assignment.status]}</span>
              </div>
            ))
          ) : (
            <span>—</span>
          )}
        </div>
      ),
    },
    {
      key: "issue",
      header: "Publication Issue",
      render: (m) => {
        const issue = m.issueId ? getIssueById(m.issueId) : undefined;
        return (
          <span className="text-xs">
            {issue ? formatIssueLabel(issue.volume, issue.issue) : "—"}
          </span>
        );
      },
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (m) => formatDate(m.updatedAt),
    },
  ];

  return (
    <AdminShell title={`Manuscripts — ${pageTitle}`}>
      <p className="mb-4 text-sm text-muted">
        Central manuscript management. Public form submissions automatically appear
        here as <strong>New Submission</strong> records — one record moves through the
        entire workflow without duplication.
      </p>

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search by ID, title, author, institution..."
        className="mb-4"
        filters={
          <>
            <SelectFilter
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: "all", label: "All Status" },
                ...Object.entries(STATUS_LABELS)
                  .filter(([k]) => !["draft", "submitted", "revision"].includes(k))
                  .map(([value, label]) => ({ value, label })),
              ]}
            />
            <SelectFilter
              label="Date"
              value={dateFilter}
              onChange={setDateFilter}
              options={[
                { value: "all", label: "All Dates" },
                { value: "30d", label: "Last 30 days" },
                { value: "90d", label: "Last 90 days" },
                { value: "year", label: "This year" },
              ]}
            />
            <SelectFilter
              label="Issue"
              value={issueFilter}
              onChange={setIssueFilter}
              options={[
                { value: "all", label: "All Issues" },
                { value: "none", label: "Unscheduled" },
                ...issues.map((i) => ({
                  value: i.id,
                  label: `Vol. ${i.volume} No. ${i.issue}`,
                })),
              ]}
            />
            <SelectFilter
              label="Reviewer"
              value={reviewerFilter}
              onChange={setReviewerFilter}
              options={[
                { value: "all", label: "All Reviewers" },
                { value: "none", label: "Unassigned" },
                ...reviewers.map((r) => ({ value: r.id, label: r.name })),
              ]}
            />
            <SelectFilter
              label="Research Area"
              value={areaFilter}
              onChange={setAreaFilter}
              options={[
                { value: "all", label: "All Areas" },
                ...RESEARCH_AREAS.map((a) => ({ value: a, label: a })),
              ]}
            />
          </>
        }
      />

      <p className="mb-4 text-xs text-muted">
        Showing {filtered.length} of {manuscripts.length} manuscripts
      </p>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DataTable data={filtered} columns={columns} pageSize={12} />
        </div>
        <ManuscriptEditor
          manuscript={selected}
          onViewManuscript={() => setViewerOpen(true)}
          onSaved={refresh}
        />
      </div>

      <ManuscriptViewer
        open={viewerOpen}
        onClose={() => setViewerOpen(false)}
        manuscripts={selected?.manuscripts}
        manuscript={selected?.manuscript}
        title={selected?.title}
      />
    </AdminShell>
  );
}

export default function ManuscriptsPage() {
  return (
    <Suspense>
      <ManuscriptsContent />
    </Suspense>
  );
}
