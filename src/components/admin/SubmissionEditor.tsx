"use client";

import { Eye, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { ReviewerSuggestions } from "@/components/forms/ReviewerSuggestions";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { STATUS_LABELS } from "@/lib/constants";
import { automateExistingSubmission } from "@/lib/submission-automation";
import {
  assignReviewer,
  getReviewerById,
  updateSubmissionStatus,
} from "@/lib/store";
import type { Submission, SubmissionStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { StatusBadge } from "@/components/ui/Badge";

interface SubmissionEditorProps {
  submission: Submission | null;
  reviewers: { id: string; name: string }[];
  onViewManuscript: () => void;
  onSaved: () => void;
}

export function SubmissionEditor({
  submission,
  reviewers,
  onViewManuscript,
  onSaved,
}: SubmissionEditorProps) {
  const [status, setStatus] = useState<SubmissionStatus>("submitted");
  const [reviewerId, setReviewerId] = useState("");

  useEffect(() => {
    if (submission) {
      setStatus(submission.status);
      setReviewerId(submission.reviewerId ?? "");
    }
  }, [submission]);

  if (!submission) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Manage Submission</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          Select a submission from the table to update status, assign a reviewer, or
          view the manuscript.
        </p>
      </Card>
    );
  }

  const automation = automateExistingSubmission(submission);
  const assigned = getReviewerById(reviewerId);

  const save = () => {
    updateSubmissionStatus(submission.id, status);
    assignReviewer(submission.id, reviewerId || undefined);
    onSaved();
  };

  return (
    <Card className="h-fit space-y-4">
      <CardHeader>
        <CardTitle>Manage Submission</CardTitle>
      </CardHeader>

      <div>
        <p className="text-sm font-medium line-clamp-2">{submission.title}</p>
        <p className="mt-1 font-mono text-xs text-muted">{submission.trackingCode}</p>
        <p className="mt-1 text-xs text-muted">
          {submission.authors.join(", ")} · {formatDate(submission.submittedAt)}
        </p>
        <div className="mt-2">
          <StatusBadge variant={submission.status}>
            {STATUS_LABELS[submission.status]}
          </StatusBadge>
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div>
          <label htmlFor="sub-status" className="mb-1 block text-xs font-medium text-muted">
            Status
          </label>
          <select
            id="sub-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as SubmissionStatus)}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-paom-blue focus:outline-none"
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="sub-reviewer" className="mb-1 block text-xs font-medium text-muted">
            Assigned Reviewer
          </label>
          <select
            id="sub-reviewer"
            value={reviewerId}
            onChange={(e) => setReviewerId(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm focus:border-paom-blue focus:outline-none"
          >
            <option value="">— Unassigned —</option>
            {reviewers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          {assigned && (
            <p className="mt-1 text-xs text-muted">{assigned.affiliation}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={onViewManuscript}>
            <Eye className="h-4 w-4" />
            {submission.manuscripts?.pdf || submission.manuscripts?.docx || submission.manuscript
              ? "View Manuscripts (PDF / DOCX)"
              : "No Files Uploaded"}
          </Button>
          <Button onClick={save}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="border-t border-border pt-4">
        <p className="mb-2 text-xs font-medium text-muted">Auto-suggested reviewers</p>
        <ReviewerSuggestions
          suggestions={automation.suggestedReviewers}
          extractedKeywords={automation.keywords}
        />
      </div>
    </Card>
  );
}
