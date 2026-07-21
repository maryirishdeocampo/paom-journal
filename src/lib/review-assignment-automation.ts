import { suggestReviewers } from "./reviewer-matching";
import type { Manuscript, ReviewAssignment, Reviewer, StoreData } from "./types";

export const FOLLOW_UP_DAYS = 7;
export const REVIEWER_RESPONSE_DAYS = 14;

export function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result.toISOString();
}

export function createReviewAssignment(
  reviewerId: string,
  assignedAt = new Date().toISOString(),
  previousReviewerIds: string[] = []
): ReviewAssignment {
  const assignedDate = new Date(assignedAt);

  return {
    reviewerId,
    status: "pending",
    assignedAt,
    followUpDate: addDays(assignedDate, FOLLOW_UP_DAYS),
    responseDeadline: addDays(assignedDate, REVIEWER_RESPONSE_DAYS),
    previousReviewerIds: previousReviewerIds.length ? previousReviewerIds : undefined,
    updatedAt: assignedAt,
  };
}

function hasReviewerResponded(assignment: ReviewAssignment): boolean {
  if (assignment.status !== "pending" || assignment.decision || assignment.remarks) {
    return true;
  }

  return Boolean(
    assignment.updatedAt &&
      new Date(assignment.updatedAt).getTime() > new Date(assignment.assignedAt).getTime()
  );
}

function getNextReviewer(
  manuscript: Manuscript,
  assignment: ReviewAssignment,
  reviewers: Reviewer[],
  additionallyExcludedIds: Set<string>
): Reviewer | undefined {
  const excludedIds = new Set([
    ...manuscript.reviewAssignments.map((item) => item.reviewerId),
    ...(assignment.previousReviewerIds ?? []),
    ...additionallyExcludedIds,
  ]);
  const eligible = reviewers.filter(
    (reviewer) => reviewer.availability !== "unavailable" && !excludedIds.has(reviewer.id)
  );

  const suggestedOrder = manuscript.suggestedReviewerIds ?? [];
  const preferred = suggestedOrder
    .map((id) => eligible.find((reviewer) => reviewer.id === id))
    .find((reviewer): reviewer is Reviewer => Boolean(reviewer));
  if (preferred) return preferred;

  const matched = suggestReviewers(manuscript.keywords, eligible, eligible.length)[0]?.reviewer;
  if (matched) return matched;

  return [...eligible].sort(
    (a, b) => a.activeReviews - b.activeReviews || a.name.localeCompare(b.name)
  )[0];
}

/**
 * Replaces pending reviewers who have made no update by their fourteen-day deadline.
 * Returns true when store data was changed.
 */
export function replaceUnresponsiveReviewers(
  data: StoreData,
  now = new Date()
): boolean {
  let changed = false;

  for (const manuscript of data.manuscripts) {
    if (["accepted", "scheduled", "published", "archived"].includes(manuscript.status)) {
      continue;
    }

    let manuscriptChanged = false;
    const reservedReviewerIds = new Set(
      manuscript.reviewAssignments.map((assignment) => assignment.reviewerId)
    );

    manuscript.reviewAssignments = manuscript.reviewAssignments.map((assignment) => {
      const deadline = new Date(assignment.responseDeadline).getTime();
      if (
        !Number.isFinite(deadline) ||
        now.getTime() < deadline ||
        hasReviewerResponded(assignment)
      ) {
        return assignment;
      }

      const replacement = getNextReviewer(
        manuscript,
        assignment,
        data.reviewers,
        reservedReviewerIds
      );
      if (!replacement) return assignment;

      changed = true;
      manuscriptChanged = true;
      reservedReviewerIds.add(replacement.id);
      return createReviewAssignment(replacement.id, now.toISOString(), [
        ...(assignment.previousReviewerIds ?? []),
        assignment.reviewerId,
      ]);
    });

    if (manuscriptChanged) {
      manuscript.assignedReviewerIds = manuscript.reviewAssignments.map(
        (assignment) => assignment.reviewerId
      );
      manuscript.updatedAt = now.toISOString();
    }
  }

  return changed;
}
