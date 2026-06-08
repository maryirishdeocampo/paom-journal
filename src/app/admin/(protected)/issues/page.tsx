"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ScheduleEditor } from "@/components/admin/ScheduleEditor";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { useStore } from "@/hooks/useStore";
import { getManuscriptsForIssue } from "@/lib/store";

export default function IssuesPage() {
  const { issues, refresh } = useStore();
  const upcoming = issues.filter((i) => i.status !== "published");

  return (
    <AdminShell title="Issues & Schedule — Upcoming">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upcoming Issues</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          Manage journal volumes and deadlines. Manuscripts are scheduled by assigning
          an issue on the Manuscripts page — the same record moves to{" "}
          <strong>Scheduled</strong> status without creating a duplicate entry.
        </p>
      </Card>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {upcoming.map((issue) => {
          const count = getManuscriptsForIssue(issue.id).length;
          return (
            <Card key={issue.id} padding="sm">
              <p className="font-semibold">
                Vol. {issue.volume} No. {issue.issue}
              </p>
              <p className="text-xs text-muted">{count} manuscript(s) scheduled</p>
            </Card>
          );
        })}
      </div>

      <ScheduleEditor issues={upcoming} onUpdated={refresh} />
    </AdminShell>
  );
}
