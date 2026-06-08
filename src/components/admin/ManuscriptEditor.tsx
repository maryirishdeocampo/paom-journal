"use client";

import { Eye, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { ReviewerSuggestions } from "@/components/forms/ReviewerSuggestions";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Input";
import { StatusBadge } from "@/components/ui/Badge";
import {
  MANUSCRIPT_WORKFLOW,
  RESEARCH_AREAS,
  REVIEW_DECISION_LABELS,
  REVIEW_STATUS_LABELS,
  STATUS_LABELS,
} from "@/lib/constants";
import { automateExistingSubmission } from "@/lib/submission-automation";
import {
  assignManuscriptToIssue,
  getIssues,
  getReviewerById,
  getReviewers,
  updateManuscript,
  updateReviewAssignments,
} from "@/lib/store";
import type {
  Manuscript,
  ManuscriptStatus,
  ReviewAssignment,
  ReviewAssignmentStatus,
  ReviewDecision,
} from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { getCorrespondingAuthor } from "@/lib/manuscript-utils";

interface ManuscriptEditorProps {
  manuscript: Manuscript | null;
  onViewManuscript: () => void;
  onSaved: () => void;
}

type ReviewSlot = {
  reviewerId: string;
  status: ReviewAssignmentStatus;
  decision: ReviewDecision | "";
  remarks: string;
};

function createEmptySlot(): ReviewSlot {
  return {
    reviewerId: "",
    status: "pending",
    decision: "",
    remarks: "",
  };
}

export function ManuscriptEditor({
  manuscript,
  onViewManuscript,
  onSaved,
}: ManuscriptEditorProps) {
  const issues = getIssues();
  const allReviewers = getReviewers();
  const [status, setStatus] = useState<ManuscriptStatus>("new_submission");
  const [reviewSlots, setReviewSlots] = useState<ReviewSlot[]>([
    createEmptySlot(),
    createEmptySlot(),
  ]);
  const [issueId, setIssueId] = useState("");
  const [researchArea, setResearchArea] = useState("");
  const [doi, setDoi] = useState("");
  const [editorialDecision, setEditorialDecision] = useState<ReviewDecision | "">("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    if (manuscript) {
      setSaveError("");
      setStatus(manuscript.status);
      const nextSlots = manuscript.reviewAssignments
        .slice(0, 2)
        .map<ReviewSlot>((assignment) => ({
          reviewerId: assignment.reviewerId,
          status: assignment.status,
          decision: assignment.decision ?? "",
          remarks: assignment.remarks ?? "",
        }));

      while (nextSlots.length < 2) {
        nextSlots.push(createEmptySlot());
      }

      setReviewSlots(nextSlots);
      setIssueId(manuscript.issueId ?? "");
      setResearchArea(manuscript.researchArea);
      setDoi(manuscript.doi ?? "");
      setEditorialDecision(manuscript.editorialDecision ?? "");
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

  const setReviewSlot = (index: number, patch: Partial<ReviewSlot>) => {
    setReviewSlots((current) =>
      current.map((slot, slotIndex) =>
        slotIndex === index ? { ...slot, ...patch } : slot
      )
    );
  };

  const getReviewerOptions = (index: number) => {
    const selectedByOthers = new Set(
      reviewSlots
        .filter((_, slotIndex) => slotIndex !== index)
        .map((slot) => slot.reviewerId)
        .filter(Boolean)
    );

    return allReviewers.filter(
      (reviewer) =>
        !selectedByOthers.has(reviewer.id) || reviewer.id === reviewSlots[index]?.reviewerId
    );
  };

  const save = () => {
    const selectedReviewerCount = reviewSlots.filter((slot) => slot.reviewerId).length;
    if (
      ["under_review", "revision_required", "accepted", "scheduled", "published"].includes(
        status
      ) &&
      selectedReviewerCount < 2
    ) {
      setSaveError("Assign two reviewers before saving manuscripts already in the review pipeline.");
      return;
    }

    setSaveError("");
    const now = new Date().toISOString();
    const reviewAssignments: ReviewAssignment[] = reviewSlots
      .filter((slot) => slot.reviewerId)
      .map((slot) => ({
        reviewerId: slot.reviewerId,
        status: slot.status,
        decision: slot.decision || undefined,
        remarks: slot.remarks.trim() || undefined,
        updatedAt: now,
      }));

    updateManuscript(manuscript.id, {
      status,
      researchArea,
      doi: doi || undefined,
      editorialDecision: editorialDecision || undefined,
    });
    updateReviewAssignments(manuscript.id, reviewAssignments);
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

        {reviewSlots.map((slot, index) => (
          <div key={`review-slot-${index}`} className="space-y-3 rounded-xl border border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold">Reviewer {index + 1}</p>
              <StatusBadge variant={slot.status}>
                {REVIEW_STATUS_LABELS[slot.status]}
              </StatusBadge>
            </div>

            <div>
              <label
                htmlFor={`ms-reviewer-${index}`}
                className="mb-1 block text-xs font-medium text-muted"
              >
                Assigned Reviewer
              </label>
              <select
                id={`ms-reviewer-${index}`}
                value={slot.reviewerId}
                onChange={(e) => setReviewSlot(index, { reviewerId: e.target.value })}
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
              >
                <option value="">— Select reviewer —</option>
                {getReviewerOptions(index).map((reviewer) => {
                  const suggested = automation.suggestedReviewers.some(
                    (suggestion) => suggestion.reviewer.id === reviewer.id
                  );
                  return (
                    <option key={reviewer.id} value={reviewer.id}>
                      {suggested ? "★ " : ""}
                      {reviewer.name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label
                htmlFor={`ms-review-status-${index}`}
                className="mb-1 block text-xs font-medium text-muted"
              >
                Review Status
              </label>
              <select
                id={`ms-review-status-${index}`}
                value={slot.status}
                onChange={(e) =>
                  setReviewSlot(index, {
                    status: e.target.value as ReviewAssignmentStatus,
                  })
                }
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
              >
                {Object.entries(REVIEW_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor={`ms-review-decision-${index}`}
                className="mb-1 block text-xs font-medium text-muted"
              >
                Review Decision
              </label>
              <select
                id={`ms-review-decision-${index}`}
                value={slot.decision}
                onChange={(e) =>
                  setReviewSlot(index, {
                    decision: e.target.value as ReviewDecision | "",
                  })
                }
                className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
              >
                <option value="">— No decision yet —</option>
                {Object.entries(REVIEW_DECISION_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <Textarea
              id={`ms-review-remarks-${index}`}
              label="Reviewer Remarks"
              placeholder="Add the reviewer’s remarks, requested revisions, or recommendation summary."
              value={slot.remarks}
              onChange={(e) => setReviewSlot(index, { remarks: e.target.value })}
              className="min-h-[96px]"
            />
          </div>
        ))}

        <p className="text-[10px] text-muted">
          Each manuscript can now carry two separate reviewer records with their own
          progress, decision, and remarks.
        </p>

        {saveError && <p className="text-xs text-paom-red">{saveError}</p>}

        <div>
          <label
            htmlFor="ms-editorial-decision"
            className="mb-1 block text-xs font-medium text-muted"
          >
            Overall Editorial Decision
          </label>
          <select
            id="ms-editorial-decision"
            value={editorialDecision}
            onChange={(e) => setEditorialDecision(e.target.value as ReviewDecision | "")}
            className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm"
          >
            <option value="">— No final decision yet —</option>
            {Object.entries(REVIEW_DECISION_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[10px] text-muted">
            This decision is shown on the submitter-facing tracking page together with
            reviewer progress.
          </p>
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

      {reviewSlots.some((slot) => slot.reviewerId) && (
        <div className="border-t border-border pt-3 text-xs text-muted">
          Assigned:{" "}
          {reviewSlots
            .map((slot) => slot.reviewerId)
            .filter(Boolean)
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
