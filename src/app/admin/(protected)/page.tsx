"use client";

import { BookOpen, FileText, Search, Users } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusChart, SubmissionsChart } from "@/components/admin/Charts";
import { KanbanBoard } from "@/components/dashboard/KanbanBoard";
import { RecentSubmissionsTable } from "@/components/dashboard/RecentSubmissionsTable";
import { ReviewerDeadlineTracker } from "@/components/dashboard/ReviewerDeadlineTracker";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { useStore } from "@/hooks/useStore";
import { getStatusDistribution } from "@/lib/store";
import { monthlySubmissions } from "@/lib/mock-data";
import { MANUSCRIPT_WORKFLOW, STATUS_LABELS } from "@/lib/constants";
import Link from "next/link";

export default function AdminDashboardPage() {
  const { manuscripts, reviewers } = useStore();
  const stats = {
    totalSubmissions: manuscripts.length,
    underReview: manuscripts.filter((m) =>
      ["screening", "under_review", "revision_required"].includes(m.status)
    ).length,
    publishedPapers: manuscripts.filter((m) => m.status === "published").length,
    activeReviewers: reviewers.filter((r) => r.availability !== "unavailable").length,
  };

  const queueCounts = MANUSCRIPT_WORKFLOW.map((status) => ({
    status,
    count: manuscripts.filter((m) => m.status === status).length,
  }));

  return (
    <AdminShell title="Dashboard">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total Manuscripts" value={stats.totalSubmissions} icon={FileText} accent="red" />
          <StatCard label="In Pipeline" value={stats.underReview} icon={Search} accent="gold" />
          <StatCard label="Published" value={stats.publishedPapers} icon={BookOpen} accent="blue" />
          <StatCard label="Active Reviewers" value={stats.activeReviewers} icon={Users} accent="red" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Workflow Queues</CardTitle>
          </CardHeader>
          <div className="flex flex-wrap gap-2">
            {queueCounts.map(({ status, count }) => (
              <Link
                key={status}
                href={`/admin/manuscripts?status=${status}`}
                className="rounded-xl border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-paom-blue/40 hover:bg-paom-blue/5"
              >
                <span className="font-medium">{STATUS_LABELS[status]}</span>
                <span className="ml-2 rounded-full bg-paom-blue/10 px-2 py-0.5 text-xs text-paom-blue">
                  {count}
                </span>
              </Link>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Publication Pipeline</CardTitle>
          </CardHeader>
          <KanbanBoard manuscripts={manuscripts} />
        </Card>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Manuscripts</CardTitle>
              </CardHeader>
              <RecentSubmissionsTable submissions={manuscripts} />
            </Card>
          </div>
          <ReviewerDeadlineTracker reviewers={reviewers} manuscripts={manuscripts} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SubmissionsChart data={monthlySubmissions} />
          <StatusChart data={getStatusDistribution()} />
        </div>
      </div>
    </AdminShell>
  );
}
