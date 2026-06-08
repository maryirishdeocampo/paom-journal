"use client";

import { AdminShell } from "@/components/admin/AdminShell";
import { ScheduleEditor } from "@/components/admin/ScheduleEditor";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { useStore } from "@/hooks/useStore";

export default function AdminSchedulePage() {
  const { scheduleIssues, refresh } = useStore();

  return (
    <AdminShell title="Publication Schedule">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Issue Tracker</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          Add, edit, or delete journal issues. Toggle &ldquo;Show on public site&rdquo;
          to control visibility. Changes save automatically to your browser.
        </p>
      </Card>
      <ScheduleEditor issues={scheduleIssues} onUpdated={refresh} />
    </AdminShell>
  );
}
