import { AdminShell } from "@/components/admin/AdminShell";
import { StatusChart, SubmissionsChart } from "@/components/admin/Charts";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatCard } from "@/components/ui/StatCard";
import { BookOpen, Clock, FileText, TrendingUp } from "lucide-react";
import {
  adminStats,
  monthlySubmissions,
  statusDistribution,
} from "@/lib/mock-data";

export default function AdminAnalyticsPage() {
  return (
    <AdminShell title="Analytics">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Avg. Review Time"
            value="28 days"
            icon={Clock}
            accent="blue"
          />
          <StatCard
            label="Acceptance Rate"
            value="34%"
            icon={TrendingUp}
            accent="gold"
          />
          <StatCard
            label="Submissions (YTD)"
            value={357}
            icon={FileText}
            accent="red"
          />
          <StatCard
            label="Publications (YTD)"
            value={42}
            icon={BookOpen}
            accent="blue"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SubmissionsChart data={monthlySubmissions} />
          <StatusChart data={statusDistribution} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-background p-4">
              <p className="text-sm text-muted">Total Submissions</p>
              <p className="text-2xl font-bold">{adminStats.totalSubmissions}</p>
            </div>
            <div className="rounded-xl bg-background p-4">
              <p className="text-sm text-muted">Active Pipeline</p>
              <p className="text-2xl font-bold">
                {adminStats.underReview + 18 + 32}
              </p>
            </div>
            <div className="rounded-xl bg-background p-4">
              <p className="text-sm text-muted">Published</p>
              <p className="text-2xl font-bold">{adminStats.publishedPapers}</p>
            </div>
          </div>
        </Card>
      </div>
    </AdminShell>
  );
}
