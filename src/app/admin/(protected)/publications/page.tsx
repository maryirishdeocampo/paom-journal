"use client";

import { useMemo, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { SearchFilter, SelectFilter } from "@/components/ui/SearchFilter";
import { StatusBadge } from "@/components/ui/Badge";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { formatIssueLabel } from "@/lib/manuscript-utils";
import { getIssueById } from "@/lib/store";
import { useStore } from "@/hooks/useStore";
import type { Manuscript } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

export default function AdminPublicationsPage() {
  const { manuscripts } = useStore();
  const published = manuscripts.filter((m) =>
    ["published", "scheduled", "archived"].includes(m.status)
  );

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const filtered = useMemo(() => {
    return published.filter((m) => {
      const matchesSearch =
        !search || m.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = status === "all" || m.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [published, search, status]);

  const columns: Column<Manuscript>[] = [
    {
      key: "title",
      header: "Title",
      render: (m) => <span className="font-medium">{m.title}</span>,
    },
    { key: "authors", header: "Authors", render: (m) => m.authors.join(", ") },
    {
      key: "status",
      header: "Status",
      render: (m) => <StatusBadge variant={m.status}>{m.status}</StatusBadge>,
    },
    {
      key: "issue",
      header: "Issue",
      render: (m) => {
        const issue = m.issueId ? getIssueById(m.issueId) : undefined;
        return issue ? formatIssueLabel(issue.volume, issue.issue) : "—";
      },
    },
    {
      key: "doi",
      header: "DOI",
      render: (m) => m.doi ?? "—",
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (m) => formatDate(m.updatedAt),
    },
  ];

  return (
    <AdminShell title="Publications">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Published & Scheduled Manuscripts</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          This view reads from the unified manuscript database — no separate publication
          records. Manage workflow on the{" "}
          <Link href="/admin/manuscripts" className="text-paom-blue hover:underline">
            Manuscripts
          </Link>{" "}
          page.
        </p>
      </Card>

      <SearchFilter
        search={search}
        onSearchChange={setSearch}
        placeholder="Search publications..."
        className="mb-6"
        filters={
          <SelectFilter
            label="Status"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "All" },
              { value: "published", label: "Published" },
              { value: "scheduled", label: "Scheduled" },
              { value: "archived", label: "Archived" },
            ]}
          />
        }
      />
      <DataTable data={filtered} columns={columns} pageSize={10} />
    </AdminShell>
  );
}
