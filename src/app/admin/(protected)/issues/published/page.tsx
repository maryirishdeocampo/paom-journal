"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { DataTable, type Column } from "@/components/ui/DataTable";
import { useStore } from "@/hooks/useStore";
import { getManuscriptsForIssue } from "@/lib/store";
import type { JournalIssue } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function PublishedIssuesPage() {
  const { issues } = useStore();
  const published = issues.filter((i) => i.status === "published");

  const columns: Column<JournalIssue>[] = [
    {
      key: "volume",
      header: "Volume / Issue",
      render: (i) => (
        <span className="font-medium">
          Vol. {i.volume} No. {i.issue}
        </span>
      ),
    },
    {
      key: "releaseDate",
      header: "Release Date",
      render: (i) => formatDate(i.releaseDate),
    },
    {
      key: "manuscripts",
      header: "Published Manuscripts",
      render: (i) => getManuscriptsForIssue(i.id).length,
    },
    {
      key: "progress",
      header: "Progress",
      render: (i) => `${i.progress}%`,
    },
  ];

  return (
    <AdminShell title="Issues & Schedule — Published">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Published Issues</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          Completed journal issues. Published manuscripts are linked to these issues
          through the unified manuscript database.
        </p>
      </Card>
      <DataTable data={published} columns={columns} pageSize={10} />
    </AdminShell>
  );
}
