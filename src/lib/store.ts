import { MANUSCRIPT_WORKFLOW } from "./constants";
import { normalizeManuscript } from "./manuscript-utils";
import {
  seedIssues,
  seedManuscripts,
  reviewers as seedReviewers,
} from "./mock-data";
import type {
  JournalIssue,
  Manuscript,
  ManuscriptStatus,
  Reviewer,
  StoreData,
} from "./types";

const STORE_KEY = "paom-store-v2";
const LEGACY_STORE_KEY = "paom-store-v1";
const STORE_EVENT = "paom-store-updated";

const ACTIVE_REVIEW_STATUSES: ManuscriptStatus[] = [
  "under_review",
  "revision_required",
];

function isBrowser() {
  return typeof window !== "undefined";
}

function migrateV1Store(v1: {
  submissions?: Record<string, unknown>[];
  scheduleIssues?: JournalIssue[];
  publications?: unknown[];
  reviewers?: Reviewer[];
}): StoreData {
  const manuscripts = (v1.submissions ?? []).map((s) =>
    normalizeManuscript(s as Record<string, unknown>)
  );

  // Merge masterlist publications not already in manuscripts
  const pubs = (v1.publications ?? []) as Array<{
    id: string;
    title: string;
    authors: string[];
    year: number;
    category: string;
    doi?: string;
    keywords: string[];
  }>;

  for (const pub of pubs) {
    if (manuscripts.some((m) => m.title === pub.title)) continue;
    const code = `PAOM-ML-${pub.id.toUpperCase()}`;
    manuscripts.push(
      normalizeManuscript({
        id: pub.id,
        trackingCode: code,
        title: pub.title,
        authors: pub.authors,
        affiliation: "Philippine Academy of Management",
        abstract: `Published article: ${pub.title}`,
        keywords: pub.keywords,
        researchArea: pub.category,
        status: "published",
        submittedAt: `${pub.year}-01-01`,
        updatedAt: `${pub.year}-06-01`,
        doi: pub.doi,
        email: "",
      })
    );
  }

  return {
    manuscripts: manuscripts.length ? manuscripts : seedManuscripts,
    reviewers: v1.reviewers ?? seedReviewers,
    issues: v1.scheduleIssues ?? seedIssues,
  };
}

function readStore(): StoreData {
  if (!isBrowser()) {
    return {
      manuscripts: seedManuscripts,
      reviewers: seedReviewers,
      issues: seedIssues,
    };
  }

  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as StoreData;
      return {
        manuscripts: parsed.manuscripts.map((m) =>
          normalizeManuscript(m as unknown as Record<string, unknown>)
        ),
        reviewers: parsed.reviewers,
        issues: parsed.issues,
      };
    }
  } catch {
    // continue
  }

  // Migrate from v1
  try {
    const v1Raw = localStorage.getItem(LEGACY_STORE_KEY);
    if (v1Raw) {
      const migrated = migrateV1Store(JSON.parse(v1Raw));
      migrateLegacyFormSubmissions(migrated);
      writeStore(migrated);
      return migrated;
    }
  } catch {
    // continue
  }

  const initial: StoreData = {
    manuscripts: seedManuscripts,
    reviewers: seedReviewers,
    issues: seedIssues,
  };
  migrateLegacyFormSubmissions(initial);
  writeStore(initial);
  return initial;
}

function migrateLegacyFormSubmissions(data: StoreData) {
  try {
    const legacy = JSON.parse(localStorage.getItem("paom-submissions") ?? "[]") as Array<
      Record<string, unknown>
    >;
    for (const item of legacy) {
      const code = item.trackingCode as string;
      if (data.manuscripts.some((m) => m.trackingCode === code)) continue;
      data.manuscripts.unshift(
        normalizeManuscript({
          ...item,
          id: code,
          status: "new_submission",
          authors:
            typeof item.authors === "string"
              ? item.authors
              : (item.authors as string[]),
          keywords:
            typeof item.keywords === "string"
              ? item.keywords
              : (item.keywords as string[]),
        })
      );
    }
  } catch {
    // ignore
  }
}

function writeStore(data: StoreData) {
  if (!isBrowser()) return;
  syncReviewerCounts(data);
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
  window.dispatchEvent(new Event(STORE_EVENT));
}

function syncReviewerCounts(data: StoreData) {
  const counts = new Map<string, number>();
  for (const m of data.manuscripts) {
    if (ACTIVE_REVIEW_STATUSES.includes(m.status)) {
      for (const rid of m.assignedReviewerIds) {
        counts.set(rid, (counts.get(rid) ?? 0) + 1);
      }
    }
  }
  data.reviewers = data.reviewers.map((r) => ({
    ...r,
    activeReviews: counts.get(r.id) ?? 0,
  }));
}

export function getStore(): StoreData {
  return readStore();
}

// ─── Manuscripts ───────────────────────────────────────────────

export function getManuscripts(): Manuscript[] {
  return readStore().manuscripts;
}

/** @deprecated */
export const getSubmissions = getManuscripts;

export function getManuscriptById(id: string): Manuscript | undefined {
  return getManuscripts().find((m) => m.id === id);
}

export function getManuscriptByCode(code: string): Manuscript | undefined {
  return getManuscripts().find(
    (m) => m.trackingCode.toUpperCase() === code.toUpperCase()
  );
}

/** @deprecated */
export const getSubmissionByCode = getManuscriptByCode;

export function getManuscriptsByStatus(status: ManuscriptStatus): Manuscript[] {
  return getManuscripts().filter((m) => m.status === status);
}

export function getPublishedManuscripts(): Manuscript[] {
  return getManuscripts().filter((m) => m.status === "published");
}

export function addManuscript(manuscript: Manuscript) {
  const data = readStore();
  data.manuscripts.unshift(normalizeManuscript(manuscript as unknown as Record<string, unknown>));
  writeStore(data);
}

/** @deprecated */
export const addSubmission = addManuscript;

export function updateManuscript(id: string, patch: Partial<Manuscript>) {
  const data = readStore();
  data.manuscripts = data.manuscripts.map((m) =>
    m.id === id
      ? normalizeManuscript({
          ...m,
          ...patch,
          updatedAt: new Date().toISOString(),
        } as unknown as Record<string, unknown>)
      : m
  );
  writeStore(data);
}

/** @deprecated */
export const updateSubmission = updateManuscript;

export function updateManuscriptStatus(id: string, status: ManuscriptStatus) {
  updateManuscript(id, { status });
}

/** @deprecated */
export const updateSubmissionStatus = updateManuscriptStatus;

export function assignReviewers(manuscriptId: string, reviewerIds: string[]) {
  updateManuscript(manuscriptId, { assignedReviewerIds: reviewerIds });
}

/** @deprecated */
export function assignReviewer(manuscriptId: string, reviewerId: string | undefined) {
  assignReviewers(manuscriptId, reviewerId ? [reviewerId] : []);
}

export function assignManuscriptToIssue(manuscriptId: string, issueId: string | undefined) {
  updateManuscript(manuscriptId, { issueId: issueId || undefined });
}

// ─── Reviewers ─────────────────────────────────────────────────

export function getReviewers(): Reviewer[] {
  return readStore().reviewers;
}

export function getReviewerById(id: string): Reviewer | undefined {
  return getReviewers().find((r) => r.id === id);
}

export function updateReviewer(id: string, patch: Partial<Reviewer>) {
  const data = readStore();
  data.reviewers = data.reviewers.map((r) => (r.id === id ? { ...r, ...patch } : r));
  writeStore(data);
}

export function addReviewer(reviewer: Reviewer) {
  const data = readStore();
  data.reviewers.push(reviewer);
  writeStore(data);
}

export function getReviewerAssignments(): Array<{
  manuscript: Manuscript;
  reviewer: Reviewer;
}> {
  const result: Array<{ manuscript: Manuscript; reviewer: Reviewer }> = [];
  for (const m of getManuscripts()) {
    for (const rid of m.assignedReviewerIds) {
      const reviewer = getReviewerById(rid);
      if (reviewer) result.push({ manuscript: m, reviewer });
    }
  }
  return result;
}

// ─── Issues ────────────────────────────────────────────────────

export function getIssues(): JournalIssue[] {
  return readStore().issues;
}

/** @deprecated */
export const getScheduleIssues = getIssues;

export function getIssueById(id: string): JournalIssue | undefined {
  return getIssues().find((i) => i.id === id);
}

export function getManuscriptsForIssue(issueId: string): Manuscript[] {
  return getManuscripts().filter((m) => m.issueId === issueId);
}

export function updateIssue(id: string, patch: Partial<JournalIssue>) {
  const data = readStore();
  data.issues = data.issues.map((i) => (i.id === id ? { ...i, ...patch } : i));
  writeStore(data);
}

/** @deprecated */
export const updateScheduleIssue = updateIssue;

export function addIssue(issue: JournalIssue) {
  const data = readStore();
  data.issues.unshift(issue);
  writeStore(data);
}

/** @deprecated */
export const addScheduleIssue = addIssue;

export function deleteIssue(id: string) {
  const data = readStore();
  data.issues = data.issues.filter((i) => i.id !== id);
  writeStore(data);
}

/** @deprecated */
export const deleteScheduleIssue = deleteIssue;

// ─── Analytics ─────────────────────────────────────────────────

export function getDashboardStats() {
  const { manuscripts, reviewers } = readStore();
  return {
    totalSubmissions: manuscripts.length,
    underReview: manuscripts.filter((m) =>
      ["screening", "under_review", "revision_required"].includes(m.status)
    ).length,
    publishedPapers: manuscripts.filter((m) => m.status === "published").length,
    activeReviewers: reviewers.filter((r) => r.availability !== "unavailable").length,
  };
}

export function getStatusDistribution() {
  const colors: Record<string, string> = {
    new_submission: "#1E22AA",
    screening: "#6366F1",
    under_review: "#F4D400",
    revision_required: "#FF8C00",
    accepted: "#22C55E",
    scheduled: "#8B5CF6",
    published: "#FF0000",
    archived: "#6B7280",
  };

  return MANUSCRIPT_WORKFLOW.map((status) => ({
    name: status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: getManuscripts().filter((m) => m.status === status).length,
    color: colors[status],
  })).filter((d) => d.value > 0);
}

export function resetStore() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORE_KEY);
  localStorage.removeItem(LEGACY_STORE_KEY);
  readStore();
}

export const STORE_UPDATE_EVENT = STORE_EVENT;
