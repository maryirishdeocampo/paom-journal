"use client";

import { BookOpen, FileText, Search, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusChart, SubmissionsChart } from "@/components/admin/Charts";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { RecentSubmissionsTable } from "@/components/dashboard/RecentSubmissionsTable";
import { ReviewerDeadlineTracker } from "@/components/dashboard/ReviewerDeadlineTracker";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { Timeline } from "@/components/schedule/Timeline";
import { useStore } from "@/hooks/useStore";
import { getStatusDistribution } from "@/lib/store";
import { monthlySubmissions } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const { submissions, reviewers, scheduleIssues } = useStore();
  const stats = {
    totalSubmissions: submissions.length,
    underReview: submissions.filter((s) =>
      ["submitted", "under_review", "revision"].includes(s.status)
    ).length,
    publishedPapers: submissions.filter((s) => s.status === "published").length,
    activeReviewers: reviewers.filter((r) => r.availability !== "unavailable").length,
  };

  return (
    <AdminShell title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Submissions" value={stats.totalSubmissions} icon={FileText} accent="red" />
          <StatCard label="Under Review" value={stats.underReview} icon={Search} accent="gold" />
          <StatCard label="Published Papers" value={stats.publishedPapers} icon={BookOpen} accent="blue" />
          <StatCard label="Active Reviewers" value={stats.activeReviewers} icon={Users} accent="red" />
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
          <StatusChart data={getStatusDistribution()} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Publication Schedule</CardTitle>
          </CardHeader>
          <Timeline issues={scheduleIssues} showInternal />
        </Card>
      </div>
    </AdminShell>
  );
}
