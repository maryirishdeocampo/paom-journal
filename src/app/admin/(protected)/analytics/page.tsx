"use client";

import { BookOpen, Clock, FileText, TrendingUp } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { StatusChart, SubmissionsChart } from "@/components/admin/Charts";
import { StatCard } from "@/components/ui/StatCard";
import { useStore } from "@/hooks/useStore";
import { getStatusDistribution } from "@/lib/store";
import { monthlySubmissions } from "@/lib/mock-data";

export default function AdminAnalyticsPage() {
  const { submissions } = useStore();

  return (
    <AdminShell title="Analytics">
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Avg. Review Time" value="28 days" icon={Clock} accent="blue" />
          <StatCard
            label="Acceptance Rate"
            value={`${submissions.length ? Math.round((submissions.filter((s) => s.status === "accepted" || s.status === "published").length / submissions.length) * 100) : 0}%`}
            icon={TrendingUp}
            accent="gold"
          />
          <StatCard label="Total Submissions" value={submissions.length} icon={FileText} accent="red" />
          <StatCard
            label="Published"
            value={submissions.filter((s) => s.status === "published").length}
            icon={BookOpen}
            accent="blue"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <SubmissionsChart data={monthlySubmissions} />
          <StatusChart data={getStatusDistribution()} />
        </div>
      </div>
    </AdminShell>
  );
}
