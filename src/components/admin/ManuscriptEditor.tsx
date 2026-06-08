"use client";

import { Eye, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { ReviewerSuggestions } from "@/components/forms/ReviewerSuggestions";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/Badge";
import { MANUSCRIPT_WORKFLOW, RESEARCH_AREAS, STATUS_LABELS } from "@/lib/constants";
import { automateExistingSubmission } from "@/lib/submission-automation";
import {
  assignManuscriptToIssue,
  assignReviewers,
  getIssues,
  getReviewerById,
  getReviewers,
  updateManuscript,
} from "@/lib/store";
import type { Manuscript, ManuscriptStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getCorrespondingAuthor } from "@/lib/manuscript-utils";

interface ManuscriptEditorProps {
  manuscript: Manuscript | null;
  onViewManuscript: () => void;
  onSaved: () => void;
}

export function ManuscriptEditor({
  manuscript,
  onViewManuscript,
  onSaved,
}: ManuscriptEditorProps) {
  const issues = getIssues();
  const allReviewers = getReviewers();
  const [status, setStatus] = useState<ManuscriptStatus>("new_submission");
  const [reviewerIds, setReviewerIds] = useState<string[]>([]);
  const [issueId, setIssueId] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [doi, setDoi] = useState("");

  useEffect(() => {
    if (manuscript) {
      setStatus(manuscript.status);
      setReviewerIds(manuscript.assignedReviewerIds);
      setIssueId(manuscript.issueId ?? "");
      setResearchArea(manuscript.researchArea);
      setDoi(manuscript.doi ?? "");
    }
  }, [manuscript]);

  if (!manuscript) {
    return (
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Manage Manuscript</CardTitle>
        </CardHeader>
        <p className="text-sm text-muted">
          Select a manuscript to update its workflow status, assign reviewers, schedule
          for an issue, or view uploaded files.
        </p>
      </Card>
    );
  }

  const automation = automateExistingSubmission(manuscript);
  const hasFiles =
    manuscript.manuscripts?.pdf ||
    manuscript.manuscripts?.docx ||
    manuscript.manuscript;

  const save = () => {
    updateManuscript(manuscript.id, {
      status,
      researchArea,
      doi: doi || undefined,
    });
    assignReviewers(manuscript.id, reviewerIds);
    assignManuscriptToIssue(manuscript.id, issueId || undefined);
    onSaved();
  };

  return (
    <Card className="h-fit space-y-4">
      <CardHeader>
        <CardTitle>Manage Manuscript</CardTitle>
      </CardHeader>

      <div>
        <p className="font-mono text-xs text-muted">{manuscript.manuscriptId}</p>
        <p className="mt-1 text-sm font-medium leading-snug">{manuscript.title}</p>
        <p className="mt-1 text-xs text-muted">
          {getCorrespondingAuthor(manuscript)} · {formatDate(manuscript.submittedAt)}
        </p>
        <div className="mt-2">
          <StatusBadge variant={manuscript.status}>
            {STATUS_LABELS[manuscript.status]}
          </StatusBadge>
        </div>
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div>
          <label htmlFor="ms-status" className="mb-1 block text-xs font-medium text-muted">
            Workflow Status
          </label>
          <select
            id="ms-status"
            value={status}
            onChange={(e) => setStatus(e.target.value as ManuscriptStatus)}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
          >
            {MANUSCRIPT_WORKFLOW.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ms-area" className="mb-1 block text-xs font-medium text-muted">
            Research Area
          </label>
          <select
            id="ms-area"
            value={researchArea}
            onChange={(e) => setResearchArea(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
          >
            {RESEARCH_AREAS.map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ms-reviewers" className="mb-1 block text-xs font-medium text-muted">
            Assigned Reviewers
          </label>
          <select
            id="ms-reviewers"
            multiple
            value={reviewerIds}
            onChange={(e) =>
              setReviewerIds(
                Array.from(e.target.selectedOptions, (o) => o.value)
              )
            }
            className="h-24 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
          >
            {allReviewers.map((reviewer) => {
              const suggested = automation.suggestedReviewers.some(
                (s) => s.reviewer.id === reviewer.id
              );
              return (
                <option key={reviewer.id} value={reviewer.id}>
                  {suggested ? "★ " : ""}
                  {reviewer.name}
                </option>
              );
            })}
          </select>
          <p className="mt-1 text-[10px] text-muted">Hold Cmd/Ctrl to select multiple. ★ = suggested</p>
        </div>

        <div>
          <label htmlFor="ms-issue" className="mb-1 block text-xs font-medium text-muted">
            Publication Issue
          </label>
          <select
            id="ms-issue"
            value={issueId}
            onChange={(e) => setIssueId(e.target.value)}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="">— Not scheduled —</option>
            {issues.map((issue) => (
              <option key={issue.id} value={issue.id}>
                Vol. {issue.volume} No. {issue.issue}
              </option>
            ))}
          </select>
        </div>

        {(status === "published" || status === "scheduled") && (
          <div>
            <label htmlFor="ms-doi" className="mb-1 block text-xs font-medium text-muted">
              DOI
            </label>
            <input
              id="ms-doi"
              value={doi}
              onChange={(e) => setDoi(e.target.value)}
              placeholder="10.1234/paom.2026.001"
              className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
            />
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Button variant="outline" onClick={onViewManuscript}>
            <Eye className="h-4 w-4" />
            {hasFiles ? "View Manuscripts (PDF / DOCX)" : "No Files Uploaded"}
          </Button>
          <Button onClick={save}>
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {reviewerIds.length > 0 && (
        <div className="border-t border-border pt-3 text-xs text-muted">
          Assigned:{" "}
          {reviewerIds
            .map((id) => getReviewerById(id)?.name)
            .filter(Boolean)
            .join(", ")}
        </div>
      )}

      <div className="border-t border-border pt-4">
        <p className="mb-2 text-xs font-medium text-muted">Suggested reviewers</p>
        <ReviewerSuggestions
          suggestions={automation.suggestedReviewers}
          extractedKeywords={automation.keywords}
        />
      </div>
    </Card>
  );
}
