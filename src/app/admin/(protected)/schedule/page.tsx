import { AdminShell } from "@/components/admin/AdminShell";
import { Timeline } from "@/components/schedule/Timeline";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { scheduleIssues } from "@/lib/mock-data";

export default function AdminSchedulePage() {
  return (
    <AdminShell title="Publication Schedule">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Issue Tracker</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          Manage journal volumes, submission deadlines, and production milestones.
          Internal planning issues are visible here but hidden from the public schedule.
        </p>
      </Card>
      <Timeline issues={scheduleIssues} showInternal />
    </AdminShell>
  );
}
