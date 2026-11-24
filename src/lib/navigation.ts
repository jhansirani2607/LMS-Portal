// AVM Smart Solutions — Navigation types & context
// Rebuilt for the Internship & LMS platform with 3 role-based portals
// (Student, Mentor, Admin) plus public site + auth + certificate verify.

export type Role = "student" | "mentor" | "admin";

export type Page =
  // ---- Public site ----
  | "home"
  | "about"
  | "internships"
  | "learning"
  | "contact"
  | "verify"
  // ---- Auth ----
  | "login"
  | "register"
  | "forgot-password"
  // ---- Student portal ----
  | "student-dashboard"
  | "student-internships"
  | "student-courses"
  | "student-course-view"
  | "student-lesson"
  | "student-assignments"
  | "student-assessments"
  | "student-project-submission"
  | "student-progress"
  | "student-certificates"
  | "student-profile"
  // ---- Mentor portal ----
  | "mentor-dashboard"
  | "mentor-students"
  | "mentor-assignments"
  | "mentor-projects"
  | "mentor-feedback"
  | "mentor-profile"
  // ---- Admin portal ----
  | "admin-dashboard"
  | "admin-students"
  | "admin-internships"
  | "admin-courses"
  | "admin-mentors"
  | "admin-applications"
  | "admin-certificates"
  | "admin-reports"
  | "admin-settings";

/**
 * NavigateParams — the optional second argument to a NavigateFn.
 * Carries context for course view / lesson player / certificate verify /
 * student detail lookups.
 */
export interface NavigateParams {
  courseId?: string;
  lessonId?: string;
  certificateId?: string;
  studentId?: string;
  domainId?: string; // prefill internship application domain
  role?: Role; // for login tab preselect
}

export interface NavigateFn {
  (page: Page, params?: NavigateParams): void;
}

// ---- Role helpers ----

const STUDENT_PORTAL_PAGES: ReadonlySet<Page> = new Set<Page>([
  "student-dashboard",
  "student-internships",
  "student-courses",
  "student-course-view",
  "student-lesson",
  "student-assignments",
  "student-assessments",
  "student-project-submission",
  "student-progress",
  "student-certificates",
  "student-profile",
]);

const MENTOR_PORTAL_PAGES: ReadonlySet<Page> = new Set<Page>([
  "mentor-dashboard",
  "mentor-students",
  "mentor-assignments",
  "mentor-projects",
  "mentor-feedback",
  "mentor-profile",
]);

const ADMIN_PORTAL_PAGES: ReadonlySet<Page> = new Set<Page>([
  "admin-dashboard",
  "admin-students",
  "admin-internships",
  "admin-courses",
  "admin-mentors",
  "admin-applications",
  "admin-certificates",
  "admin-reports",
  "admin-settings",
]);

export function isStudentPortal(page: Page): boolean {
  return STUDENT_PORTAL_PAGES.has(page);
}

export function isMentorPortal(page: Page): boolean {
  return MENTOR_PORTAL_PAGES.has(page);
}

export function isAdminPortal(page: Page): boolean {
  return ADMIN_PORTAL_PAGES.has(page);
}

export function isPortalPage(page: Page): boolean {
  return (
    STUDENT_PORTAL_PAGES.has(page) ||
    MENTOR_PORTAL_PAGES.has(page) ||
    ADMIN_PORTAL_PAGES.has(page)
  );
}

/** Returns the Role whose portal the page belongs to, or null if public. */
export function portalRoleForPage(page: Page): Role | null {
  if (STUDENT_PORTAL_PAGES.has(page)) return "student";
  if (MENTOR_PORTAL_PAGES.has(page)) return "mentor";
  if (ADMIN_PORTAL_PAGES.has(page)) return "admin";
  return null;
}

/** Returns the dashboard page for a given role. */
export function dashboardForRole(role: Role): Page {
  switch (role) {
    case "student":
      return "student-dashboard";
    case "mentor":
      return "mentor-dashboard";
    case "admin":
      return "admin-dashboard";
  }
}

export const AUTH_STORAGE_KEY = "avm_auth_role";
