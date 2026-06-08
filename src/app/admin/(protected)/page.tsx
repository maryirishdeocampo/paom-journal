import {
  BookOpen,
  FileText,
  Search,
  Users,
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusChart, SubmissionsChart } from "@/components/admin/Charts";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { RecentSubmissionsTable } from "@/components/dashboard/RecentSubmissionsTable";
import { ReviewerDeadlineTracker } from "@/components/dashboard/ReviewerDeadlineTracker";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Timeline } from "@/components/schedule/Timeline";
import {
  adminStats,
  monthlySubmissions,
  reviewers,
  scheduleIssues,
  statusDistribution,
  submissions,
} from "@/lib/mock-data";

export default function AdminDashboardPage() {
  return (
    <AdminShell title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Submissions"
            value={adminStats.totalSubmissions}
            icon={FileText}
            accent="red"
            trend="+12% from last month"
          />
          <StatCard
            label="Under Review"
            value={adminStats.underReview}
            icon={Search}
            accent="gold"
            trend="18 due this week"
          />
          <StatCard
            label="Published Papers"
            value={adminStats.publishedPapers}
            icon={BookOpen}
            accent="blue"
            trend="32 accepted pending"
          />
          <StatCard
            label="Active Reviewers"
            value={adminStats.activeReviewers}
            icon={Users}
            accent="red"
            trend="6 with upcoming deadlines"
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Publication Pipeline</CardTitle>
          </CardHeader>
          <KanbanBoard submissions={submissions} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Submissions</CardTitle>
              </CardHeader>
              <RecentSubmissionsTable submissions={submissions} />
            </Card>
          </div>
          <ReviewerDeadlineTracker reviewers={reviewers} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SubmissionsChart data={monthlySubmissions} />
          <StatusChart data={statusDistribution} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upcoming Publication Schedule</CardTitle>
          </CardHeader>
          <Timeline issues={scheduleIssues} showInternal />
        </Card>
      </div>
    </AdminShell>
  );
}
