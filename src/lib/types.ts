export type SubmissionStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "revision"
  | "accepted"
  | "published";

export type Role = "visitor" | "submitter" | "reviewer" | "admin";

export interface Submission {
  id: string;
  trackingCode: string;
  title: string;
  authors: string[];
  affiliation: string;
  abstract: string;
  keywords: string[];
  status: SubmissionStatus;
  submittedAt: string;
  reviewerId?: string;
  email?: string;
}

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

export interface Publication {
  id: string;
  title: string;
  authors: string[];
  year: number;
  category: string;
  status: "published" | "in_press";
  doi?: string;
  keywords: string[];
}

export interface ScheduleIssue {
  id: string;
  volume: string;
  issue: string;
  releaseDate: string;
  submissionDeadline: string;
  progress: number;
  status: "planning" | "open" | "review" | "production" | "published";
  isPublic: boolean;
}

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
