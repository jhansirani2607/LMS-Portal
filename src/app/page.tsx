"use client";

import * as React from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingButtons } from "@/components/layout/FloatingButtons";

// Public pages
import { HomePage } from "@/components/pages/HomePage";
import { AboutPage } from "@/components/pages/AboutPage";
import { InternshipsPage } from "@/components/pages/InternshipsPage";
import { LearningPage } from "@/components/pages/LearningPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { VerifyPage } from "@/components/pages/VerifyPage";

// Auth pages
import { LoginPage } from "@/components/pages/LoginPage";
import { RegisterPage } from "@/components/pages/RegisterPage";
import { ForgotPasswordPage } from "@/components/pages/ForgotPasswordPage";

// Student portal — layout + LMS pages (repurposed)
import { LMSLayout as StudentLayout } from "@/components/lms/LMSLayout";
import { LMSDashboard as StudentDashboard } from "@/components/lms/pages/LMSDashboard";
import { LMSMyCourses as StudentCourses } from "@/components/lms/pages/LMSMyCourses";
import { LMSCourseView as StudentCourseView } from "@/components/lms/pages/LMSCourseView";
import { LMSLessonPlayer as StudentLesson } from "@/components/lms/pages/LMSLessonPlayer";
import { LMSAssignments as StudentAssignments } from "@/components/lms/pages/LMSAssignments";
import { LMSQuizzes as StudentAssessments } from "@/components/lms/pages/LMSQuizzes";
import { LMSGrades as StudentProgress } from "@/components/lms/pages/LMSGrades";
import { LMSCertificates as StudentCertificates } from "@/components/lms/pages/LMSCertificates";
import { LMSProfile as StudentProfile } from "@/components/lms/pages/LMSProfile";
import { StudentInternships } from "@/components/student/StudentInternships";
import { StudentProjectSubmission } from "@/components/student/StudentProjectSubmission";

// Mentor portal
import { MentorLayout } from "@/components/mentor/MentorLayout";
import { MentorDashboard } from "@/components/mentor/pages/MentorDashboard";
import { MentorStudents } from "@/components/mentor/pages/MentorStudents";
import { MentorAssignments } from "@/components/mentor/pages/MentorAssignments";
import { MentorProjects } from "@/components/mentor/pages/MentorProjects";
import { MentorFeedback } from "@/components/mentor/pages/MentorFeedback";
import { MentorProfile } from "@/components/mentor/pages/MentorProfile";

// Admin portal
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/components/admin/pages/AdminDashboard";
import { AdminStudents } from "@/components/admin/pages/AdminStudents";
import { AdminInternships } from "@/components/admin/pages/AdminInternships";
import { AdminCourses } from "@/components/admin/pages/AdminCourses";
import { AdminMentors } from "@/components/admin/pages/AdminMentors";
import { AdminApplications } from "@/components/admin/pages/AdminApplications";
import { AdminCertificates } from "@/components/admin/pages/AdminCertificates";
import { AdminReports } from "@/components/admin/pages/AdminReports";
import { AdminSettings } from "@/components/admin/pages/AdminSettings";

import { lmsUser, currentMentor } from "@/lib/data";
import {
  getCurrentUser,
  setCurrentUser as setStoredCurrentUser,
  getAdminStudentsList,
  type AuthUser,
} from "@/lib/portal-store";
import {
  AUTH_STORAGE_KEY,
  dashboardForRole,
  isPortalPage,
  isStudentPortal,
  isMentorPortal,
  isAdminPortal,
  portalRoleForPage,
  type NavigateFn,
  type NavigateParams,
  type Page,
  type Role,
} from "@/lib/navigation";

export default function Home() {
  const [activePage, setActivePage] = React.useState<Page>("home");
  const [params, setParams] = React.useState<NavigateParams>({});
  const [authRole, setAuthRole] = React.useState<Role | null>(null);
  const [currentUser, setCurrentUser] = React.useState<AuthUser | null>(null);
  const [authChecked, setAuthChecked] = React.useState(false);

  // Read auth role and user from localStorage once on mount (avoids SSR mismatch).
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored === "student" || stored === "mentor" || stored === "admin") {
        setAuthRole(stored);
      } else {
        setAuthRole(null);
      }
      const user = getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
    } catch {
      setAuthRole(null);
    }
    setAuthChecked(true);
  }, []);

  // Keep active user and role synchronized in real-time across tabs and admin changes
  React.useEffect(() => {
    const syncAuth = () => {
      const user = getCurrentUser();
      setCurrentUser(user);
      try {
        const storedRole = localStorage.getItem(AUTH_STORAGE_KEY) as Role | null;
        if (storedRole && (storedRole === "student" || storedRole === "mentor" || storedRole === "admin")) {
          setAuthRole(storedRole);
        } else if (!storedRole) {
          setAuthRole(null);
        }
      } catch {
        /* ignore */
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("avm_store_updated", syncAuth);
      window.addEventListener("storage", syncAuth);
      return () => {
        window.removeEventListener("avm_store_updated", syncAuth);
        window.removeEventListener("storage", syncAuth);
      };
    }
  }, []);

  const navigate = React.useCallback<NavigateFn>((page, p) => {
    setActivePage(page);
    setParams(p ?? {});
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  }, []);

  const loginAsRole = React.useCallback(
    (role: Role, user?: AuthUser) => {
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, role);
      } catch {
        /* ignore storage errors */
      }
      if (user) {
        setStoredCurrentUser(user);
        setCurrentUser(user);
      }
      setAuthRole(role);
      navigate(dashboardForRole(role));
    },
    [navigate]
  );

  const logout = React.useCallback(() => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setStoredCurrentUser(null);
    setCurrentUser(null);
    setAuthRole(null);
    navigate("home");
  }, [navigate]);

  // If user lands on "login" while already authed, redirect to their dashboard.
  React.useEffect(() => {
    if (!authChecked) return;
    if (activePage === "login" && authRole) {
      navigate(dashboardForRole(authRole));
    }
  }, [authChecked, activePage, authRole, navigate]);

  // If user lands on a portal page without the matching role, send to login.
  React.useEffect(() => {
    if (!authChecked) return;
    if (isPortalPage(activePage)) {
      const required = portalRoleForPage(activePage);
      if (required && authRole !== required) {
        navigate("login", { role: required });
      }
    }
  }, [authChecked, activePage, authRole, navigate]);

  const showPublicChrome =
    !isPortalPage(activePage) &&
    activePage !== "login" &&
    activePage !== "register" &&
    activePage !== "forgot-password";

  const isHome = activePage === "home";

  // Don't render anything portal-related until localStorage check is done,
  // to avoid flashing the login redirect on a hard refresh.
  if (
    !authChecked &&
    (isPortalPage(activePage) ||
      activePage === "login" ||
      activePage === "register" ||
      activePage === "forgot-password")
  ) {
    return (
      <div className="min-h-screen bg-[var(--bg-base)] flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-[var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  const activeStudentUser: typeof lmsUser = React.useMemo(() => {
    if (currentUser && currentUser.role === "student") {
      const adminList = getAdminStudentsList();
      const adminRec = adminList.find(
        (s) =>
          s.id === currentUser.id ||
          s.email.toLowerCase() === currentUser.email.toLowerCase()
      );

      return {
        name: currentUser.name,
        email: currentUser.email,
        avatarInitials: currentUser.avatarInitials,
        role: "Student",
        enrolledOn: currentUser.enrolledOn || adminRec?.enrolledOn || "2024-08-15",
        studentId: currentUser.id,
        phone: currentUser.phone || adminRec?.phone || "+91 98765 43210",
        education: currentUser.education || adminRec?.education || "B.Tech Computer Science",
        yearOfStudy: currentUser.yearOfStudy || adminRec?.yearOfStudy || "3rd Year",
        preferredDomain: adminRec?.domain || currentUser.preferredDomain || "MERN Full Stack Development",
        mentor: adminRec?.mentor || currentUser.mentor || "Mahendra Cheerla",
        progress: adminRec?.progress ?? currentUser.progress ?? 45,
        status: adminRec?.status || currentUser.status || "Active",
      };
    }
    return lmsUser;
  }, [currentUser]);

  // Portal pages — wrapped in their role's layout.
  if (isPortalPage(activePage)) {
    const required = portalRoleForPage(activePage);
    if (required && authRole !== required) {
      // Render login with the required role preselected; the redirect effect
      // above will fire to actually navigate to "login".
      return (
        <LoginPage onNavigate={navigate} onLogin={loginAsRole} initialRole={required} />
      );
    }

    if (isStudentPortal(activePage) && authRole === "student") {
      return (
        <StudentLayout
          activePage={activePage}
          user={activeStudentUser}
          onNavigate={navigate}
          onLogout={logout}
        >
          {renderStudentPage(activePage, params, navigate, logout, activeStudentUser)}
        </StudentLayout>
      );
    }

    if (isMentorPortal(activePage) && authRole === "mentor") {
      return (
        <MentorLayout
          activePage={activePage}
          mentor={currentMentor}
          onNavigate={navigate}
          onLogout={logout}
        >
          {renderMentorPage(activePage, navigate, logout)}
        </MentorLayout>
      );
    }

    if (isAdminPortal(activePage) && authRole === "admin") {
      return (
        <AdminLayout
          activePage={activePage}
          onNavigate={navigate}
          onLogout={logout}
        >
          {renderAdminPage(activePage, navigate, logout)}
        </AdminLayout>
      );
    }
  }

  // Auth pages
  if (activePage === "login") {
    if (authRole) {
      // Already logged in — render the dashboard directly to avoid a flash.
      return renderPortalForRole(authRole, activePage, params, navigate, logout, activeStudentUser);
    }
    return (
      <LoginPage
        onNavigate={navigate}
        onLogin={loginAsRole}
        initialRole={params.role}
      />
    );
  }
  if (activePage === "register") {
    return <RegisterPage onNavigate={navigate} />;
  }
  if (activePage === "forgot-password") {
    return <ForgotPasswordPage onNavigate={navigate} />;
  }

  // Public site
  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-base)]">
      {showPublicChrome && (
        <Header
          activePage={activePage}
          authRole={authRole}
          onNavigate={navigate}
          onLogout={logout}
        />
      )}

      <main className={`flex-1 ${isHome ? "" : "pt-16 md:pt-18"}`}>
        {renderPublicPage(activePage, navigate)}
      </main>

      {showPublicChrome && <Footer onNavigate={navigate} />}

      {showPublicChrome && <FloatingButtons />}
    </div>
  );
}

// ---- Renderers ----

function renderPortalForRole(
  role: Role,
  activePage: Page,
  params: NavigateParams,
  navigate: NavigateFn,
  logout: () => void,
  studentUser?: typeof lmsUser
): React.ReactNode {
  if (role === "student") {
    const dashPage = dashboardForRole("student");
    return (
      <StudentLayout activePage={dashPage} user={studentUser || lmsUser} onNavigate={navigate} onLogout={logout}>
        <StudentDashboard onNavigate={navigate} user={studentUser} />
      </StudentLayout>
    );
  }
  if (role === "mentor") {
    const dashPage = dashboardForRole("mentor");
    return (
      <MentorLayout activePage={dashPage} mentor={currentMentor} onNavigate={navigate} onLogout={logout}>
        <MentorDashboard onNavigate={navigate} />
      </MentorLayout>
    );
  }
  const dashPage = dashboardForRole("admin");
  return (
    <AdminLayout activePage={dashPage} onNavigate={navigate} onLogout={logout}>
      <AdminDashboard onNavigate={navigate} />
    </AdminLayout>
  );
}

function renderPublicPage(page: Page, navigate: NavigateFn): React.ReactNode {
  switch (page) {
    case "home":
      return <HomePage onNavigate={navigate} />;
    case "about":
      return <AboutPage onNavigate={navigate} />;
    case "internships":
      return <InternshipsPage onNavigate={navigate} />;
    case "learning":
      return <LearningPage onNavigate={navigate} />;
    case "contact":
      return <ContactPage onNavigate={navigate} />;
    case "verify":
      return <VerifyPage />;
    default:
      return <HomePage onNavigate={navigate} />;
  }
}

function renderStudentPage(
  page: Page,
  params: NavigateParams,
  navigate: NavigateFn,
  logout: () => void,
  user?: typeof lmsUser
): React.ReactNode {
  switch (page) {
    case "student-dashboard":
      return <StudentDashboard onNavigate={navigate} user={user} />;
    case "student-internships":
      return <StudentInternships user={user} />;
    case "student-courses":
      return <StudentCourses onNavigate={navigate} user={user} />;
    case "student-course-view":
      return (
        <StudentCourseView
          courseId={params.courseId ?? ""}
          onNavigate={navigate}
        />
      );
    case "student-lesson":
      return (
        <StudentLesson
          courseId={params.courseId ?? ""}
          lessonId={params.lessonId ?? ""}
          onNavigate={navigate}
        />
      );
    case "student-assignments":
      return <StudentAssignments user={user} />;
    case "student-assessments":
      return <StudentAssessments />;
    case "student-project-submission":
      return <StudentProjectSubmission />;
    case "student-progress":
      return <StudentProgress />;
    case "student-certificates":
      return <StudentCertificates onNavigate={navigate} user={user} />;
    case "student-profile":
      return <StudentProfile onLogout={logout} user={user} />;
    default:
      return <StudentDashboard onNavigate={navigate} user={user} />;
  }
}

function renderMentorPage(
  page: Page,
  navigate: NavigateFn,
  logout: () => void
): React.ReactNode {
  switch (page) {
    case "mentor-dashboard":
      return <MentorDashboard onNavigate={navigate} />;
    case "mentor-students":
      return <MentorStudents />;
    case "mentor-assignments":
      return <MentorAssignments />;
    case "mentor-projects":
      return <MentorProjects />;
    case "mentor-feedback":
      return <MentorFeedback />;
    case "mentor-profile":
      return <MentorProfile onLogout={logout} />;
    default:
      return <MentorDashboard onNavigate={navigate} />;
  }
}

function renderAdminPage(
  page: Page,
  navigate: NavigateFn,
  logout: () => void
): React.ReactNode {
  switch (page) {
    case "admin-dashboard":
      return <AdminDashboard onNavigate={navigate} />;
    case "admin-students":
      return <AdminStudents />;
    case "admin-internships":
      return <AdminInternships />;
    case "admin-courses":
      return <AdminCourses />;
    case "admin-mentors":
      return <AdminMentors />;
    case "admin-applications":
      return <AdminApplications />;
    case "admin-certificates":
      return <AdminCertificates />;
    case "admin-reports":
      return <AdminReports />;
    case "admin-settings":
      return <AdminSettings onLogout={logout} />;
    default:
      return <AdminDashboard onNavigate={navigate} />;
  }
}
