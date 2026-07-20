"use client";

import { useMemo } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { REVIEW_DECISION_LABELS, REVIEW_STATUS_LABELS, STATUS_LABELS } from "@/lib/constants";
import { getReviewerById } from "@/lib/store";
import { useStore } from "@/hooks/useStore";
import { formatDate } from "@/lib/utils";
import type { Manuscript, ReviewAssignmentStatus, ReviewDecision } from "@/lib/types";

type Row = {
  id: string;
  reviewerName: string;
  manuscriptId: string;
  title: string;
  manuscriptStatus: Manuscript["status"];
  reviewStatus: ReviewAssignmentStatus;
  reviewDecision: ReviewDecision | undefined;
  remarks: string | undefined;
  deadline: string | undefined;
  followUpDate: string | undefined;
};

export default function ReviewerAssignmentsPage() {
  const { manuscripts } = useStore();

  const rows = useMemo(() => {
    return manuscripts.flatMap((manuscript) =>
      manuscript.reviewAssignments
        .map((assignment) => {
          const reviewer = getReviewerById(assignment.reviewerId);
          if (!reviewer) return null;
          return {
            id: `${manuscript.id}-${reviewer.id}`,
            reviewerName: reviewer.name,
            manuscriptId: manuscript.manuscriptId,
            title: manuscript.title,
            manuscriptStatus: manuscript.status,
            reviewStatus: assignment.status,
            reviewDecision: assignment.decision,
            remarks: assignment.remarks,
            deadline: reviewer.deadline,
            followUpDate: reviewer.followUpDate,
          };
        })
        .filter((row): row is Row => row !== null)
    );
  }, [manuscripts]);

  const columns: Column<Row>[] = [
    { key: "reviewer", header: "Reviewer", render: (r) => r.reviewerName },
    {
      key: "id",
      header: "Manuscript ID",
      render: (r) => <span className="font-mono text-xs">{r.manuscriptId}</span>,
    },
    {
      key: "title",
      header: "Title",
      render: (r) => <span className="line-clamp-1 max-w-xs">{r.title}</span>,
    },
    {
      key: "reviewStatus",
      header: "Review Status",
      render: (r) => (
        <StatusBadge variant={r.reviewStatus}>
          {REVIEW_STATUS_LABELS[r.reviewStatus]}
        </StatusBadge>
      ),
    },
    {
      key: "decision",
      header: "Decision",
      render: (r) =>
        r.reviewDecision ? (
          <StatusBadge variant={r.reviewDecision}>
            {REVIEW_DECISION_LABELS[r.reviewDecision]}
          </StatusBadge>
        ) : (
          <span className="text-xs text-muted">—</span>
        ),
    },
    {
      key: "manuscriptStatus",
      header: "Manuscript Status",
      render: (r) => (
        <StatusBadge variant={r.manuscriptStatus}>
          {STATUS_LABELS[r.manuscriptStatus]}
        </StatusBadge>
      ),
    },
    {
      key: "deadline",
      header: "Follow-up / Deadline",
      render: (r) => (
        <div className="space-y-0.5 text-xs">
          <p>Deadline: {r.deadline ? formatDate(r.deadline) : "Not set"}</p>
          <p className="text-muted">
            Follow-up: {r.followUpDate ? formatDate(r.followUpDate) : "Not set"}
          </p>
        </div>
      ),
    },
    {
      key: "remarks",
      header: "Remarks",
      render: (r) => (
        <span className="line-clamp-2 max-w-xs text-xs text-muted">
          {r.remarks || "—"}
        </span>
      ),
    },
  ];

  return (
    <AdminShell title="Reviewer Assignments">
      <p className="mb-4 text-sm text-muted">
        Active reviewer-to-manuscript assignments from the unified manuscript database.
        Assign reviewers on the Manuscripts page.
      </p>
      <DataTable data={rows} columns={columns} pageSize={15} />
    </AdminShell>
  );
}
