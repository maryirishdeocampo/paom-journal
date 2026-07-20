import { ExternalLink } from "lucide-react";
import { PageTransition } from "@/components/public/PageTransition";
import { Card } from "@/components/ui/Card";
import { OFFICIAL_ISSUES_URL } from "@/lib/constants";

export default function ArchivePage() {
  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Publications Archive</h1>
          <p className="mt-2 text-muted">
            Browse past PAoM e-Journal issues on the official PAoM website.
          </p>
        </div>

        <Card className="text-center">
          <p className="text-sm text-muted">
            Published issues are hosted on the Philippine Academy of Management website.
          </p>
          <a
            href={OFFICIAL_ISSUES_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-paom-blue px-6 py-3 font-medium text-white transition-colors hover:bg-blue-900"
          >
            View Published Issues
            <ExternalLink className="h-4 w-4" />
          </a>
          <a
            href={OFFICIAL_ISSUES_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block break-all text-sm text-paom-blue underline-offset-4 hover:underline"
          >
            {OFFICIAL_ISSUES_URL}
          </a>
        </Card>
      </div>
    </PageTransition>
  );
}
