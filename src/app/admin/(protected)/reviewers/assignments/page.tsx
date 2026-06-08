"use client";

import { useMemo } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";
import { STATUS_LABELS } from "@/lib/constants";
import { getReviewerById } from "@/lib/store";
import { useStore } from "@/hooks/useStore";
import type { Manuscript } from "@/lib/types";

type Row = {
  id: string;
  reviewerName: string;
  manuscriptId: string;
  title: string;
  status: Manuscript["status"];
};

export default function ReviewerAssignmentsPage() {
  const { manuscripts } = useStore();

  const rows = useMemo(() => {
    return manuscripts.flatMap((manuscript) =>
      manuscript.assignedReviewerIds
        .map((reviewerId) => {
          const reviewer = getReviewerById(reviewerId);
          if (!reviewer) return null;
          return {
            id: `${manuscript.id}-${reviewer.id}`,
            reviewerName: reviewer.name,
            manuscriptId: manuscript.manuscriptId,
            title: manuscript.title,
            status: manuscript.status,
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
      key: "status",
      header: "Manuscript Status",
      render: (r) => (
        <StatusBadge variant={r.status}>{STATUS_LABELS[r.status]}</StatusBadge>
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
