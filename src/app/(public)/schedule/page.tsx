import { PageTransition } from "@/components/public/PageTransition";
import { Timeline } from "@/components/schedule/Timeline";
import { scheduleIssues } from "@/lib/mock-data";

export const metadata = {
  title: "Publication Schedule",
};

export default function SchedulePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Publication Schedule</h1>
          <p className="mt-2 text-muted">
            Upcoming journal releases, submission deadlines, and publication milestones.
          </p>
        </div>
        <Timeline issues={scheduleIssues} />
      </div>
    </PageTransition>
  );
}
