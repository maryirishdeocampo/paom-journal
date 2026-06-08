import type { Role } from "./types";

export const can = {
  viewAllSubmissions: (role: Role) => role === "admin",
  viewOwnSubmission: (role: Role) =>
    role === "submitter" || role === "admin",
  editSubmissionStatus: (role: Role) => role === "admin",
  manageReviewers: (role: Role) => role === "admin",
  editSchedule: (role: Role) => role === "admin",
  submitManuscript: () => true,
  viewAdminDashboard: (role: Role) => role === "admin",
};
