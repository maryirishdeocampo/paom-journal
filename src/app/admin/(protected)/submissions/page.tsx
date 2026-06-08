"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { StatusBadge } from "@/components/ui/Badge";
import { STATUS_LABELS } from "@/lib/constants";
import { submissions } from "@/lib/mock-data";
import type { Submission } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const columns: Column<Submission>[] = [
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
];

export default function AdminSubmissionsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      const matchesSearch =
        !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
        s.authors.some((a) => a.toLowerCase().includes(search.toLowerCase()));
      const matchesStatus = status === "all" || s.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [search, status]);

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
      <DataTable data={filtered} columns={columns} pageSize={10} />
    </AdminShell>
  );
}
