/** Unified manuscript workflow statuses */
export type ManuscriptStatus =
  | "new_submission"
  | "screening"
  | "under_review"
  | "revision_required"
  | "accepted"
  | "scheduled"
  | "published"
  | "archived";

/** @deprecated Use ManuscriptStatus */
export type SubmissionStatus = ManuscriptStatus;

export type Role = "visitor" | "submitter" | "reviewer" | "admin";

export interface ManuscriptFile {
  fileName: string;
  fileType: string;
  dataUrl: string;
}

export interface SubmissionManuscripts {
  pdf?: ManuscriptFile;
  docx?: ManuscriptFile;
}

/** Single manuscript record — moves through workflow without duplication */
export interface Manuscript {
  id: string;
  manuscriptId: string;
  trackingCode: string;
  title: string;
  authors: string[];
  affiliation: string;
  abstract: string;
  keywords: string[];
  researchArea: string;
  status: ManuscriptStatus;
  submittedAt: string;
  updatedAt: string;
  assignedReviewerIds: string[];
  issueId?: string;
  doi?: string;
  email?: string;
  /** @deprecated use manuscripts */
  manuscript?: ManuscriptFile;
  manuscripts?: SubmissionManuscripts;
  suggestedReviewerIds?: string[];
}

/** Alias for backward compatibility */
export type Submission = Manuscript;

export interface Reviewer {
  id: string;
  name: string;
  affiliation: string;
  expertise: string[];
  availability: "available" | "limited" | "unavailable";
  activeReviews: number;
  email: string;
  deadline?: string;
}

export interface JournalIssue {
  id: string;
  volume: string;
  issue: string;
  releaseDate: string;
  submissionDeadline: string;
  progress: number;
  status: "planning" | "open" | "review" | "production" | "published";
  isPublic: boolean;
}

/** @deprecated Use JournalIssue */
export type ScheduleIssue = JournalIssue;

export interface DashboardStats {
  totalSubmissions: number;
  underReview: number;
  publishedPapers: number;
  activeReviewers: number;
}

export interface SubmissionFormData {
  title: string;
  authors: string;
  affiliation: string;
  abstract: string;
  keywords: string;
  email: string;
}

export interface StoreData {
  manuscripts: Manuscript[];
  reviewers: Reviewer[];
  issues: JournalIssue[];
}
