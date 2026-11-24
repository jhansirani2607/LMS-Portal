"use client";

import * as React from "react";
import {
  BookOpen,
  CheckCircle2,
  Award,
  TrendingUp,
  ArrowRight,
  Clock,
  ClipboardList,
  FileQuestion,
  GraduationCap,
  Calendar,
  Briefcase,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { ProgressBar, CourseThumb, StatusBadge } from "@/components/lms/LMSUI";
import {
  lmsUser,
  lmsCourses,
  lmsDashboardStats,
  lmsAssignments,
  lmsActivity,
  firstIncompleteLesson,
  studentInternships,
} from "@/lib/data";
import {
  getStudentEnrolledCourses,
  getStudentPendingCourses,
} from "@/lib/portal-store";
import type { NavigateFn } from "@/lib/navigation";

interface LMSDashboardProps {
  onNavigate: NavigateFn;
  user?: import("@/lib/data").LMSUser;
}

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  lesson: CheckCircle2,
  assignment: ClipboardList,
  quiz: FileQuestion,
  certificate: Award,
  enrollment: BookOpen,
};

export function LMSDashboard({ onNavigate, user }: LMSDashboardProps) {
  const activeUser = user || lmsUser;
  const [syncKey, setSyncKey] = React.useState(0);

  React.useEffect(() => {
    const handleSync = () => setSyncKey((k) => k + 1);
    if (typeof window !== "undefined") {
      window.addEventListener("avm_store_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        window.removeEventListener("avm_store_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
  }, []);

  const enrolledCourses = React.useMemo(() => {
    return getStudentEnrolledCourses(activeUser.email, activeUser.preferredDomain);
  }, [activeUser.email, activeUser.preferredDomain, syncKey]);

  const pendingCourseRequests = React.useMemo(() => {
    return getStudentPendingCourses(activeUser.email);
  }, [activeUser.email, syncKey]);

  // Pick the lowest-progress in-progress course for "Continue Learning" strictly from student's enrolled courses!
  const continueCourse = React.useMemo(() => {
    if (enrolledCourses.length === 0) return lmsCourses[0];
    const inProgress = enrolledCourses.filter(
      (c) => c.progress > 0 && c.progress < 100
    );
    if (inProgress.length === 0) return enrolledCourses[0];
    return [...inProgress].sort((a, b) => a.progress - b.progress)[0];
  }, [enrolledCourses]);

  const nextLesson = firstIncompleteLesson(continueCourse);

  const userInternships = React.useMemo(() => {
    if (activeUser?.preferredDomain) {
      const personalInternship = {
        id: "active-user-internship",
        domainId: "custom",
        domainTitle: activeUser.preferredDomain,
        mentorName: activeUser.mentor || "Technical Mentor (Pending Assignment)",
        mentorRole: "Assigned Project Guide",
        startDate: activeUser.enrolledOn || "2026-01-15",
        duration: "12 Weeks (3 Months)",
        progress: typeof activeUser.progress === "number" ? activeUser.progress : 15,
        status: (activeUser.status === "Pending Approval" ? "Pending Approval" : (activeUser.status === "Rejected" ? "Rejected" : "In Progress")) as any,
        weeklyTasks: [],
      };
      // For a student, show their primary internship plus any other approved courses as internship tracks
      const additionalTracks = enrolledCourses
        .filter((c) => c.title.toLowerCase() !== activeUser.preferredDomain?.toLowerCase())
        .map((c) => ({
          id: `track-${c.id}`,
          domainId: c.id,
          domainTitle: c.title,
          mentorName: activeUser.mentor || "Technical Mentor",
          mentorRole: "Course Guide",
          startDate: "2026-02-01",
          duration: c.duration,
          progress: c.progress,
          status: "In Progress" as const,
          weeklyTasks: [],
        }));
      return [personalInternship, ...additionalTracks];
    }
    return [studentInternships[0]];
  }, [activeUser, enrolledCourses]);

  const enrolledCourseIds = React.useMemo(
    () => new Set(enrolledCourses.map((c) => c.id.toLowerCase())),
    [enrolledCourses]
  );

  // Upcoming deadlines — strictly matched to student's enrolled courses
  const upcomingDeadlines = React.useMemo(() => {
    const today = new Date("2026-11-25");
    const matched = lmsAssignments.filter((a) =>
      enrolledCourseIds.has(a.courseId.toLowerCase())
    );

    const source = matched.length > 0 ? matched : [
      {
        id: "asg-custom",
        courseId: continueCourse.id,
        courseTitle: continueCourse.title,
        title: `${continueCourse.title} Project Milestone 1`,
        dueDate: "2026-12-10",
        status: "pending" as const,
        description: `Complete milestone implementation for ${continueCourse.title}.`,
        maxMarks: 100,
      }
    ];

    return source
      .filter((a) => a.status === "pending" || a.status === "overdue")
      .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
      .slice(0, 3)
      .map((a) => {
        const due = new Date(a.dueDate);
        const days = Math.ceil((+due - +today) / (1000 * 60 * 60 * 24));
        return { ...a, daysLeft: days };
      });
  }, [enrolledCourseIds, continueCourse]);

  const totalLessonsCount = React.useMemo(() => {
    return enrolledCourses.reduce((sum, c) => sum + (c.totalLessons || 12), 0);
  }, [enrolledCourses]);

  const completedLessonsCount = React.useMemo(() => {
    return enrolledCourses.reduce((sum, c) => sum + (c.completedLessons || 0), 0);
  }, [enrolledCourses]);

  const stats = [
    {
      label: "Enrolled Courses",
      value: enrolledCourses.length,
      icon: BookOpen,
      gradient: "from-[#6366f1] to-[#a855f7]",
    },
    {
      label: "Completed Lessons",
      value: completedLessonsCount,
      sub: `of ${totalLessonsCount}`,
      icon: CheckCircle2,
      gradient: "from-[#22d3ee] to-[#6366f1]",
    },
    {
      label: "Average Score",
      value: `${activeUser.progress ? Math.min(100, activeUser.progress + 10) : 85}%`,
      icon: TrendingUp,
      gradient: "from-[#f59e0b] to-[#ef4444]",
    },
    {
      label: "Certificates",
      value: activeUser.progress === 100 ? 1 : 0,
      icon: Award,
      gradient: "from-[#22c55e] to-[#10b981]",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Welcome back, {activeUser.name.split(" ")[0]} 👋
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Enrolled Track:{" "}
              <span className="text-[var(--primary)] font-semibold">
                {activeUser.preferredDomain || "MERN Full Stack Development"}
              </span>{" "}
              • Mentor:{" "}
              <span className="text-[var(--text-primary)] font-semibold">
                {activeUser.mentor || "Mahendra Cheerla"}
              </span>{" "}
              • Progress:{" "}
              <span className="text-emerald-400 font-semibold">
                {activeUser.progress ?? 68}%
              </span>
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <AVMButton
              variant="outline"
              onClick={() => onNavigate("student-courses")}
              iconRight={<ArrowRight size={16} />}
            >
              My Courses
            </AVMButton>
            <AVMButton
              onClick={() => onNavigate("student-courses")}
              icon={<BookOpen size={16} />}
            >
              + Enroll in Another Course
            </AVMButton>
          </div>
        </div>
      </Reveal>

      {/* Pending Course Requests Banner */}
      {pendingCourseRequests.length > 0 && (
        <Reveal>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 text-sm">
            <div className="flex items-center gap-2.5">
              <Clock size={18} className="text-amber-400 shrink-0" />
              <span>
                You have requested enrollment in{" "}
                <strong className="text-white">
                  {pendingCourseRequests.map((p) => p.courseTitle).join(", ")}
                </strong>
                . Awaiting Admin approval!
              </span>
            </div>
            <button
              onClick={() => onNavigate("student-courses")}
              className="text-xs font-semibold text-amber-400 hover:text-white underline underline-offset-4 text-left"
            >
              View Status →
            </button>
          </div>
        </Reveal>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Reveal key={stat.label} delay={i * 70}>
              <div className="card-hover h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5">
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white`}
                >
                  <Icon size={22} />
                </div>
                <div className="font-heading text-3xl font-bold text-[var(--text-primary)] tabular-nums">
                  {stat.value}
                  {stat.sub && (
                    <span className="ml-1 text-sm font-medium text-[var(--text-secondary)]">
                      {stat.sub}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-[var(--text-secondary)]">{stat.label}</p>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Continue Learning + Upcoming Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning */}
        <Reveal className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Continue Learning
              </h3>
              <button
                onClick={() =>
                  onNavigate("student-course-view", { courseId: continueCourse.id })
                }
                className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
              >
                View course
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-5 items-start">
              <CourseThumb
                gradient={continueCourse.thumbnail}
                category={continueCourse.category}
              />
              <div className="flex flex-col gap-3">
                <div>
                  <h4 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                    {continueCourse.title}
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Instructor: {continueCourse.instructor}
                  </p>
                </div>
                <ProgressBar
                  value={continueCourse.progress}
                  showLabel
                />
                <p className="text-xs text-[var(--text-secondary)]">
                  {continueCourse.completedLessons} / {continueCourse.totalLessons} lessons completed
                </p>
                {nextLesson && (
                  <AVMButton
                    size="sm"
                    onClick={() =>
                      onNavigate("student-lesson", {
                        courseId: continueCourse.id,
                        lessonId: nextLesson.lesson.id,
                      })
                    }
                    iconRight={<ArrowRight size={15} />}
                    className="self-start"
                  >
                    Resume: {nextLesson.lesson.title}
                  </AVMButton>
                )}
              </div>
            </div>
          </div>
        </Reveal>

        {/* Upcoming deadlines */}
        <Reveal delay={100}>
          <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={18} className="text-[var(--primary)]" />
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Upcoming Deadlines
              </h3>
            </div>
            <ul className="flex flex-col gap-3">
              {upcomingDeadlines.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3"
                >
                  <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1">
                    {a.title}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-1">
                    {a.courseTitle}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">
                      Due {new Date(a.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                    <span
                      className={`text-xs font-semibold ${
                        a.daysLeft < 0
                          ? "text-red-300"
                          : a.daysLeft <= 7
                          ? "text-amber-300"
                          : "text-emerald-300"
                      }`}
                    >
                      {a.daysLeft < 0
                        ? `${Math.abs(a.daysLeft)}d overdue`
                        : `${a.daysLeft}d left`}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* Progress overview + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Reveal className="lg:col-span-2">
          <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap size={18} className="text-[var(--primary)]" />
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Progress Overview
              </h3>
            </div>
            <ul className="flex flex-col gap-4">
              {lmsCourses.map((c) => (
                <li key={c.id}>
                  <button
                    onClick={() => onNavigate("student-course-view", { courseId: c.id })}
                    className="group flex flex-col gap-2 w-full text-left"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                        {c.title}
                      </span>
                      <span className="text-xs text-[var(--text-secondary)] shrink-0">
                        {c.completedLessons}/{c.totalLessons}
                      </span>
                    </div>
                    <ProgressBar value={c.progress} showLabel size="sm" />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-[var(--primary)]" />
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                Recent Activity
              </h3>
            </div>
            <ul className="flex flex-col gap-3 max-h-96 overflow-y-auto pr-1">
              {lmsActivity.map((act) => {
                const Icon = ACTIVITY_ICONS[act.type] ?? CheckCircle2;
                return (
                  <li key={act.id} className="flex gap-3">
                    <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-elevated)] text-[var(--primary)]">
                      <Icon size={14} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-[var(--text-primary)] leading-snug">
                        {act.text}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                        {act.timestamp}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </Reveal>
      </div>

      {/* My Internships widget */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-[var(--primary)]" />
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                My Internships
              </h3>
            </div>
            <button
              onClick={() => onNavigate("student-internships")}
              className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
            >
              View all
            </button>
          </div>
          <ul className="flex flex-col gap-3">
            {userInternships.map((si) => (
              <li
                key={si.id}
                className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-[var(--text-primary)]">
                    {si.domainTitle}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    Mentor: {si.mentorName} • Started {new Date(si.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} • {si.duration}
                  </p>
                </div>
                <div className="w-full sm:w-48">
                  <ProgressBar value={si.progress} showLabel size="sm" />
                </div>
                <StatusBadge
                  status={si.status}
                  variant={si.status === "Completed" ? "success" : "info"}
                />
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}
