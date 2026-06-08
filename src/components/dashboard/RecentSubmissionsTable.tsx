"use client";

import type { Submission } from "@/lib/types";
import { STATUS_LABELS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { StatusBadge } from "@/components/ui/Badge";

const columns: Column<Submission>[] = [
  {
    key: "trackingCode",
    header: "Tracking Code",
    render: (s) => <span className="font-mono text-xs">{s.trackingCode}</span>,
  },
  {
    key: "title",
    header: "Title",
    render: (s) => (
      <span className="line-clamp-1 max-w-xs font-medium">{s.title}</span>
    ),
  },
  {
    key: "authors",
    header: "Author",
    render: (s) => s.authors[0],
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
];

interface RecentSubmissionsTableProps {
  submissions: Submission[];
}

export function RecentSubmissionsTable({ submissions }: RecentSubmissionsTableProps) {
  return (
    <DataTable
      data={submissions}
      columns={columns}
      pageSize={5}
      emptyMessage="No submissions yet."
    />
  );
}
