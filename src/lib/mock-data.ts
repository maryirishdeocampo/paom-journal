import type {
  DashboardStats,
  JournalIssue,
  Manuscript,
  ReviewAssignment,
  ReviewDecision,
  Reviewer,
} from "./types";
import { inferResearchArea } from "./manuscript-utils";

export const publicStats: DashboardStats = {
  totalSubmissions: 1247,
  underReview: 86,
  publishedPapers: 892,
  activeReviewers: 48,
};

function buildReviewAssignment(
  reviewerId: string,
  status: ReviewAssignment["status"],
  decision?: ReviewDecision,
  remarks?: string
): ReviewAssignment {
  return {
    reviewerId,
    status,
    decision,
    remarks,
    updatedAt: new Date().toISOString(),
  };
}

function m(
  partial: Omit<
    Manuscript,
    "researchArea" | "updatedAt" | "assignedReviewerIds" | "manuscriptId" | "reviewAssignments"
  > & {
  researchArea?: string;
  updatedAt?: string;
  assignedReviewerIds?: string[];
  reviewAssignments?: ReviewAssignment[];
  manuscriptId?: string;
  reviewerId?: string;
}
): Manuscript {
  const keywords = partial.keywords;
  const reviewAssignments =
    partial.reviewAssignments ??
    (partial.reviewerId
      ? [buildReviewAssignment(partial.reviewerId, "in_review")]
      : []);
  return {
    ...partial,
    manuscriptId: partial.manuscriptId ?? partial.trackingCode,
    researchArea: partial.researchArea ?? inferResearchArea(keywords),
    updatedAt: partial.updatedAt ?? partial.submittedAt,
    reviewAssignments,
    assignedReviewerIds:
      partial.assignedReviewerIds ?? reviewAssignments.map((assignment) => assignment.reviewerId),
  };
}

export const seedManuscripts: Manuscript[] = [
  m({
    id: "1",
    trackingCode: "PAOM-2026-A3F9K2",
    title: "Digital Transformation in Philippine SMEs: A Longitudinal Study",
    authors: ["Maria Santos", "Juan Dela Cruz"],
    affiliation: "University of the Philippines Diliman",
    abstract:
      "This study examines the adoption patterns of digital technologies among small and medium enterprises in the Philippines over a five-year period.",
    keywords: ["digital transformation", "SMEs", "Philippines"],
    researchArea: "Digital Transformation",
    status: "under_review",
    submittedAt: "2026-01-15",
    updatedAt: "2026-02-10",
    reviewAssignments: [
      buildReviewAssignment("r1", "in_review"),
      buildReviewAssignment("r4", "pending"),
    ],
    email: "maria.santos@up.edu.ph",
  }),
  m({
    id: "2",
    trackingCode: "PAOM-2026-B7X2M1",
    title: "Leadership Styles and Organizational Resilience Post-Pandemic",
    authors: ["Ana Reyes"],
    affiliation: "Ateneo de Manila University",
    abstract:
      "An empirical analysis of how transformational and servant leadership styles influenced organizational resilience during and after the COVID-19 pandemic.",
    keywords: ["leadership", "resilience", "pandemic"],
    researchArea: "Leadership",
    status: "new_submission",
    submittedAt: "2026-02-28",
    email: "ana.reyes@ateneo.edu",
  }),
  m({
    id: "3",
    trackingCode: "PAOM-2026-C1P8N4",
    title: "Sustainable Supply Chain Practices in ASEAN Manufacturing",
    authors: ["Carlos Mendoza", "Lisa Tan"],
    affiliation: "De La Salle University",
    abstract:
      "This paper investigates sustainable supply chain management practices adopted by manufacturing firms across ASEAN member states.",
    keywords: ["supply chain", "sustainability", "ASEAN"],
    researchArea: "Supply Chain",
    status: "revision_required",
    submittedAt: "2025-11-20",
    updatedAt: "2026-01-05",
    reviewAssignments: [
      buildReviewAssignment(
        "r2",
        "completed",
        "major_revisions",
        "Strengthen the methodology discussion and expand the ASEAN comparison."
      ),
      buildReviewAssignment(
        "r6",
        "completed",
        "minor_revisions",
        "Clarify the sampling criteria and tighten the conclusion."
      ),
    ],
    editorialDecision: "major_revisions",
    email: "carlos.m@dlsu.edu.ph",
  }),
  m({
    id: "4",
    trackingCode: "PAOM-2025-D4Q6R9",
    title: "Corporate Governance and Firm Performance in Listed Philippine Companies",
    authors: ["Roberto Garcia"],
    affiliation: "University of Santo Tomas",
    abstract:
      "A quantitative study examining the relationship between corporate governance indices and financial performance metrics.",
    keywords: ["corporate governance", "firm performance"],
    researchArea: "Corporate Governance",
    status: "accepted",
    submittedAt: "2025-09-10",
    updatedAt: "2026-01-20",
    reviewAssignments: [
      buildReviewAssignment(
        "r3",
        "completed",
        "without_revisions",
        "The paper is ready for acceptance with only copyediting."
      ),
      buildReviewAssignment(
        "r1",
        "completed",
        "without_revisions",
        "A strong contribution with clear empirical grounding."
      ),
    ],
    editorialDecision: "without_revisions",
    email: "r.garcia@ust.edu.ph",
  }),
  m({
    id: "5",
    trackingCode: "PAOM-2025-E2S5T7",
    title: "Entrepreneurial Ecosystem Development in Metro Manila",
    authors: ["Patricia Lim", "Mark Villanueva"],
    affiliation: "Asian Institute of Management",
    abstract:
      "This research maps the entrepreneurial ecosystem in Metro Manila and identifies key enablers and barriers to startup growth.",
    keywords: ["entrepreneurship", "ecosystem", "startups"],
    researchArea: "Entrepreneurship",
    status: "published",
    submittedAt: "2025-06-01",
    updatedAt: "2025-12-01",
    reviewAssignments: [
      buildReviewAssignment("r1", "completed", "without_revisions"),
      buildReviewAssignment("r5", "completed", "minor_revisions"),
    ],
    editorialDecision: "without_revisions",
    issueId: "s3",
    doi: "10.1234/paom.2025.001",
    email: "p.lim@aim.edu",
  }),
  m({
    id: "6",
    trackingCode: "PAOM-2026-F8U3V2",
    title: "Work-Life Balance Policies in Hybrid Work Environments",
    authors: ["Grace Fernandez"],
    affiliation: "University of San Carlos",
    abstract:
      "An exploratory study on the effectiveness of work-life balance policies in organizations adopting hybrid work models.",
    keywords: ["work-life balance", "hybrid work", "HR policies"],
    researchArea: "Human Resources",
    status: "screening",
    submittedAt: "2026-03-01",
    email: "g.fernandez@usc.edu.ph",
  }),
  m({
    id: "7",
    trackingCode: "PAOM-2025-G1H4J6",
    title: "Corporate Social Responsibility and Brand Equity in Filipino Firms",
    authors: ["Angela Morales"],
    affiliation: "De La Salle University",
    abstract:
      "Examines the relationship between CSR initiatives and brand equity among publicly listed Filipino corporations.",
    keywords: ["CSR", "brand equity", "marketing"],
    researchArea: "Marketing",
    status: "published",
    submittedAt: "2025-04-15",
    updatedAt: "2025-11-15",
    issueId: "s3",
    doi: "10.1234/paom.2025.002",
    email: "a.morales@dlsu.edu.ph",
  }),
  m({
    id: "8",
    trackingCode: "PAOM-2026-H2K5L8",
    title: "Agile Project Management in Government IT Initiatives",
    authors: ["Ricardo Santos", "Liza Gomez"],
    affiliation: "University of the Philippines",
    abstract:
      "A case study analysis of agile methodologies applied to government digital transformation projects.",
    keywords: ["agile", "government", "IT"],
    researchArea: "Project Management",
    status: "scheduled",
    submittedAt: "2025-10-01",
    updatedAt: "2026-02-15",
    issueId: "s2",
    reviewAssignments: [
      buildReviewAssignment("r4", "completed", "minor_revisions"),
      buildReviewAssignment("r3", "completed", "without_revisions"),
    ],
    editorialDecision: "minor_revisions",
    email: "r.santos@up.edu.ph",
  }),
];

/** @deprecated */
export const submissions = seedManuscripts;

export const reviewers: Reviewer[] = [
  {
    id: "r1",
    name: "Dr. Elena Villanueva",
    affiliation: "University of the Philippines",
    expertise: ["Strategic Management", "Digital Transformation", "SMEs"],
    availability: "available",
    activeReviews: 3,
    email: "e.villanueva@up.edu.ph",
    deadline: "2026-04-15",
    followUpDate: "2026-04-10",
  },
  {
    id: "r2",
    name: "Prof. Michael Ong",
    affiliation: "Ateneo de Manila University",
    expertise: ["Supply Chain", "Operations Management", "Sustainability"],
    availability: "limited",
    activeReviews: 5,
    email: "m.ong@ateneo.edu",
    deadline: "2026-03-30",
  },
  {
    id: "r3",
    name: "Dr. Sofia Ramirez",
    affiliation: "De La Salle University",
    expertise: ["Corporate Governance", "Finance", "Ethics"],
    availability: "available",
    activeReviews: 2,
    email: "s.ramirez@dlsu.edu.ph",
    deadline: "2026-05-01",
  },
  {
    id: "r4",
    name: "Prof. James Tan",
    affiliation: "Asian Institute of Management",
    expertise: ["Human Resources", "Organizational Behavior", "Leadership"],
    availability: "available",
    activeReviews: 4,
    email: "j.tan@aim.edu",
    deadline: "2026-04-01",
  },
  {
    id: "r5",
    name: "Dr. Patricia Cruz",
    affiliation: "University of Santo Tomas",
    expertise: ["Entrepreneurship", "Innovation", "Marketing"],
    availability: "unavailable",
    activeReviews: 0,
    email: "p.cruz@ust.edu.ph",
  },
  {
    id: "r6",
    name: "Prof. Daniel Reyes",
    affiliation: "University of San Carlos",
    expertise: ["International Business", "ASEAN Studies", "Trade"],
    availability: "limited",
    activeReviews: 3,
    email: "d.reyes@usc.edu.ph",
    deadline: "2026-04-20",
  },
];

export const seedIssues: JournalIssue[] = [
  {
    id: "s1",
    volume: "12",
    issue: "1",
    releaseDate: "2026-06-30",
    submissionDeadline: "2026-03-31",
    progress: 60,
    status: "open",
    isPublic: true,
  },
  {
    id: "s2",
    volume: "11",
    issue: "4",
    releaseDate: "2026-03-15",
    submissionDeadline: "2025-12-15",
    progress: 90,
    status: "production",
    isPublic: true,
  },
  {
    id: "s3",
    volume: "11",
    issue: "3",
    releaseDate: "2025-12-01",
    submissionDeadline: "2025-09-01",
    progress: 100,
    status: "published",
    isPublic: true,
  },
  {
    id: "s4",
    volume: "12",
    issue: "2",
    releaseDate: "2026-12-15",
    submissionDeadline: "2026-09-30",
    progress: 15,
    status: "planning",
    isPublic: false,
  },
];

/** @deprecated */
export const scheduleIssues = seedIssues;

export const monthlySubmissions = [
  { month: "Oct", count: 42 },
  { month: "Nov", count: 58 },
  { month: "Dec", count: 35 },
  { month: "Jan", count: 67 },
  { month: "Feb", count: 81 },
  { month: "Mar", count: 74 },
];
