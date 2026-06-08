import type { Manuscript, ManuscriptStatus } from "./types";

const LEGACY_STATUS_MAP: Record<string, ManuscriptStatus> = {
  draft: "new_submission",
  submitted: "new_submission",
  under_review: "under_review",
  revision: "revision_required",
  accepted: "accepted",
  published: "published",
};

export function normalizeStatus(status: string): ManuscriptStatus {
  if (status in LEGACY_STATUS_MAP) return LEGACY_STATUS_MAP[status];
  return status as ManuscriptStatus;
}

export function inferResearchArea(keywords: string[]): string {
  if (keywords.length === 0) return "General Management";
  const first = keywords[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
}

export function normalizeManuscript(raw: Record<string, unknown>): Manuscript {
  const keywords = Array.isArray(raw.keywords)
    ? (raw.keywords as string[])
    : typeof raw.keywords === "string"
      ? raw.keywords.split(",").map((k) => k.trim())
      : [];

  const authors = Array.isArray(raw.authors)
    ? (raw.authors as string[])
    : typeof raw.authors === "string"
      ? raw.authors.split(",").map((a) => a.trim())
      : [];

  const assignedReviewerIds = Array.isArray(raw.assignedReviewerIds)
    ? (raw.assignedReviewerIds as string[])
    : raw.reviewerId
      ? [raw.reviewerId as string]
      : [];

  const trackingCode = (raw.trackingCode ?? raw.manuscriptId ?? raw.id) as string;
  const submittedAt = (raw.submittedAt as string) ?? new Date().toISOString();
  const status = normalizeStatus((raw.status as string) ?? "new_submission");

  return {
    id: raw.id as string,
    manuscriptId: (raw.manuscriptId as string) ?? trackingCode,
    trackingCode,
    title: raw.title as string,
    authors,
    affiliation: raw.affiliation as string,
    abstract: raw.abstract as string,
    keywords,
    researchArea:
      (raw.researchArea as string) ?? inferResearchArea(keywords),
    status,
    submittedAt,
    updatedAt: (raw.updatedAt as string) ?? submittedAt,
    assignedReviewerIds,
    issueId: raw.issueId as string | undefined,
    doi: raw.doi as string | undefined,
    email: raw.email as string | undefined,
    manuscript: raw.manuscript as Manuscript["manuscript"],
    manuscripts: raw.manuscripts as Manuscript["manuscripts"],
    suggestedReviewerIds: raw.suggestedReviewerIds as string[] | undefined,
  };
}

export function formatIssueLabel(volume?: string, issue?: string): string {
  if (!volume || !issue) return "—";
  return `Vol. ${volume} No. ${issue}`;
}

export function getCorrespondingAuthor(m: Manuscript): string {
  return m.authors[0] ?? "—";
}
