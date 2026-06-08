import {
  publications as seedPublications,
  reviewers as seedReviewers,
  scheduleIssues as seedSchedule,
  submissions as seedSubmissions,
} from "./mock-data";
import type {
  Publication,
  Reviewer,
  ScheduleIssue,
  StoreData,
  Submission,
  SubmissionStatus,
} from "./types";

const STORE_KEY = "paom-store-v1";
const STORE_EVENT = "paom-store-updated";

function isBrowser() {
  return typeof window !== "undefined";
}

function readStore(): StoreData {
  if (!isBrowser()) {
    return {
      submissions: seedSubmissions,
      reviewers: seedReviewers,
      scheduleIssues: seedSchedule,
      publications: seedPublications,
    };
  }

  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) {
      return JSON.parse(raw) as StoreData;
    }
  } catch {
    // fall through to seed
  }

  const initial: StoreData = {
    submissions: seedSubmissions,
    reviewers: seedReviewers,
    scheduleIssues: seedSchedule,
    publications: seedPublications,
  };

  migrateLegacySubmissions(initial);
  writeStore(initial);
  return initial;
}

function migrateLegacySubmissions(data: StoreData) {
  try {
    const legacy = JSON.parse(localStorage.getItem("paom-submissions") ?? "[]") as Array<{
      trackingCode: string;
      title: string;
      authors: string;
      affiliation: string;
      abstract: string;
      keywords: string;
      email: string;
      submittedAt: string;
      fileName?: string;
      fileType?: string;
      fileDataUrl?: string;
      suggestedReviewers?: Array<{ id: string }>;
    }>;

    for (const item of legacy) {
      if (data.submissions.some((s) => s.trackingCode === item.trackingCode)) continue;
      data.submissions.unshift({
        id: item.trackingCode,
        trackingCode: item.trackingCode,
        title: item.title,
        authors: item.authors.split(",").map((a) => a.trim()),
        affiliation: item.affiliation,
        abstract: item.abstract,
        keywords: item.keywords.split(",").map((k) => k.trim()),
        status: "submitted",
        submittedAt: item.submittedAt,
        email: item.email,
        suggestedReviewerIds: item.suggestedReviewers?.map((r) => r.id),
        manuscript:
          item.fileDataUrl && item.fileName
            ? {
                fileName: item.fileName,
                fileType: item.fileType ?? "application/pdf",
                dataUrl: item.fileDataUrl,
              }
            : undefined,
      });
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
  for (const s of data.submissions) {
    if (s.reviewerId && ["under_review", "revision"].includes(s.status)) {
      counts.set(s.reviewerId, (counts.get(s.reviewerId) ?? 0) + 1);
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

export function getSubmissions(): Submission[] {
  return readStore().submissions;
}

export function getSubmissionByCode(code: string): Submission | undefined {
  return getSubmissions().find(
    (s) => s.trackingCode.toUpperCase() === code.toUpperCase()
  );
}

export function addSubmission(submission: Submission) {
  const data = readStore();
  data.submissions.unshift(submission);
  writeStore(data);
}

export function updateSubmission(id: string, patch: Partial<Submission>) {
  const data = readStore();
  data.submissions = data.submissions.map((s) =>
    s.id === id ? { ...s, ...patch } : s
  );
  writeStore(data);
}

export function updateSubmissionStatus(id: string, status: SubmissionStatus) {
  updateSubmission(id, { status });
}

export function assignReviewer(submissionId: string, reviewerId: string | undefined) {
  updateSubmission(submissionId, { reviewerId: reviewerId || undefined });
}

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

export function getScheduleIssues(): ScheduleIssue[] {
  return readStore().scheduleIssues;
}

export function updateScheduleIssue(id: string, patch: Partial<ScheduleIssue>) {
  const data = readStore();
  data.scheduleIssues = data.scheduleIssues.map((i) =>
    i.id === id ? { ...i, ...patch } : i
  );
  writeStore(data);
}

export function addScheduleIssue(issue: ScheduleIssue) {
  const data = readStore();
  data.scheduleIssues.unshift(issue);
  writeStore(data);
}

export function deleteScheduleIssue(id: string) {
  const data = readStore();
  data.scheduleIssues = data.scheduleIssues.filter((i) => i.id !== id);
  writeStore(data);
}

export function getPublications(): Publication[] {
  return readStore().publications;
}

export function getPublicPublications(): Publication[] {
  return getPublications().filter((p) => p.status === "published");
}

export function updatePublication(id: string, patch: Partial<Publication>) {
  const data = readStore();
  data.publications = data.publications.map((p) =>
    p.id === id ? { ...p, ...patch } : p
  );
  writeStore(data);
}

export function getDashboardStats() {
  const { submissions, reviewers, publications } = readStore();
  return {
    totalSubmissions: submissions.length,
    underReview: submissions.filter((s) =>
      ["submitted", "under_review", "revision"].includes(s.status)
    ).length,
    publishedPapers: publications.filter((p) => p.status === "published").length,
    activeReviewers: reviewers.filter((r) => r.availability !== "unavailable").length,
  };
}

export function getStatusDistribution() {
  const submissions = getSubmissions();
  const counts: Record<string, number> = {
    submitted: 0,
    under_review: 0,
    revision: 0,
    accepted: 0,
    published: 0,
  };
  for (const s of submissions) {
    if (counts[s.status] !== undefined) counts[s.status]++;
  }
  return [
    { name: "Submitted", value: counts.submitted, color: "#1E22AA" },
    { name: "Under Review", value: counts.under_review, color: "#F4D400" },
    { name: "Revision", value: counts.revision, color: "#FF8C00" },
    { name: "Accepted", value: counts.accepted, color: "#22C55E" },
    { name: "Published", value: counts.published, color: "#FF0000" },
  ];
}

export function resetStore() {
  if (!isBrowser()) return;
  localStorage.removeItem(STORE_KEY);
  readStore();
}

export const STORE_UPDATE_EVENT = STORE_EVENT;
