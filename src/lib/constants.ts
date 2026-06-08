import type {
  ManuscriptStatus,
  ReviewAssignmentStatus,
  ReviewDecision,
} from "./types";

export const BRAND = {
  name: "Philippine Academy of Management",
  shortName: "PAoM",
  tagline: "Advancing Management Scholarship in the Philippines",
} as const;

export const CONTACT = {
  title: "CONTACT US",
  organization: "De La Salle University",
  department: "Center for Business Research and Development",
  addressLine1: "Second Floor, Faculty Center",
  addressLine2: "2401 Taft Avenue, Manila, Philippines",
  telephone: "632-465-8939; 632-5244611 local 437 or 149",
  email: "contact@paomassociation.org",
} as const;

export const PUBLIC_NAV = [
  { href: "/", label: "Home" },
  { href: "/submit", label: "Submit" },
  { href: "/my-submissions", label: "My Submissions" },
  { href: "/archive", label: "Publications" },
  { href: "/about", label: "About" },
] as const;

export const MANUSCRIPT_WORKFLOW: ManuscriptStatus[] = [
  "new_submission",
  "screening",
  "under_review",
  "revision_required",
  "accepted",
  "scheduled",
  "published",
  "archived",
];

export const STATUS_LABELS: Record<ManuscriptStatus | string, string> = {
  new_submission: "New Submission",
  screening: "Screening",
  under_review: "Under Review",
  revision_required: "Revision Required",
  accepted: "Accepted",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
  // legacy mappings
  draft: "New Submission",
  submitted: "New Submission",
  revision: "Revision Required",
};

export const REVIEW_STATUS_LABELS: Record<ReviewAssignmentStatus, string> = {
  pending: "Pending",
  in_review: "In Review",
  completed: "Completed",
};

export const REVIEW_DECISION_LABELS: Record<ReviewDecision, string> = {
  major_revisions: "Major Revisions",
  minor_revisions: "Minor Revisions",
  without_revisions: "Without Revisions",
  not_accepted: "Not Accepted",
  encourage_resubmit: "Encourage to Resubmit",
  reject: "Reject",
};

export const RESEARCH_AREAS = [
  "Strategic Management",
  "Leadership",
  "Entrepreneurship",
  "Finance",
  "Marketing",
  "Human Resources",
  "Operations Management",
  "Supply Chain",
  "Corporate Governance",
  "Digital Transformation",
  "International Business",
  "Project Management",
] as const;

export const KANBAN_COLUMNS = [
  "new_submission",
  "screening",
  "under_review",
  "revision_required",
  "accepted",
  "scheduled",
  "published",
] as const;

export type AdminNavItem = {
  label: string;
  href?: string;
  icon?: string;
  children?: { label: string; href: string; status?: ManuscriptStatus }[];
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  {
    label: "Manuscripts",
    icon: "FileText",
    children: [
      { label: "All Manuscripts", href: "/admin/manuscripts" },
      { label: "New Submissions", href: "/admin/manuscripts?status=new_submission", status: "new_submission" },
      { label: "Screening", href: "/admin/manuscripts?status=screening", status: "screening" },
      { label: "Under Review", href: "/admin/manuscripts?status=under_review", status: "under_review" },
      { label: "Revision Required", href: "/admin/manuscripts?status=revision_required", status: "revision_required" },
      { label: "Accepted", href: "/admin/manuscripts?status=accepted", status: "accepted" },
      { label: "Scheduled", href: "/admin/manuscripts?status=scheduled", status: "scheduled" },
      { label: "Published", href: "/admin/manuscripts?status=published", status: "published" },
      { label: "Archived", href: "/admin/manuscripts?status=archived", status: "archived" },
    ],
  },
  {
    label: "Reviewers",
    icon: "Users",
    children: [
      { label: "All Reviewers", href: "/admin/reviewers" },
      { label: "Assignments", href: "/admin/reviewers/assignments" },
      { label: "Performance", href: "/admin/reviewers/performance" },
    ],
  },
  {
    label: "Issues & Schedule",
    icon: "Calendar",
    children: [
      { label: "Upcoming Issues", href: "/admin/issues" },
      { label: "Published Issues", href: "/admin/issues/published" },
    ],
  },
  { label: "Publications", href: "/admin/publications", icon: "BookOpen" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart3" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
];
