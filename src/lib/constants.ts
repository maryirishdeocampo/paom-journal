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

export const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/admin/submissions", label: "Submissions", icon: "FileText" },
  { href: "/admin/reviewers", label: "Reviewers", icon: "Users" },
  { href: "/admin/schedule", label: "Schedule", icon: "Calendar" },
  { href: "/admin/publications", label: "Publications", icon: "BookOpen" },
  { href: "/admin/analytics", label: "Analytics", icon: "BarChart3" },
  { href: "/admin/settings", label: "Settings", icon: "Settings" },
] as const;

export const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  submitted: "Submitted",
  under_review: "Under Review",
  revision: "Revision",
  accepted: "Accepted",
  published: "Published",
};

export const KANBAN_COLUMNS = [
  "submitted",
  "under_review",
  "revision",
  "accepted",
  "published",
] as const;
