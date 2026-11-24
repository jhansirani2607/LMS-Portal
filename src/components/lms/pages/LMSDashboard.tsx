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
import type { NavigateFn } from "@/lib/navigation";

interface LMSDashboardProps {
  onNavigate: NavigateFn;
}

const ACTIVITY_ICONS: Record<string, React.ElementType> = {
  lesson: CheckCircle2,
  assignment: ClipboardList,
  quiz: FileQuestion,
  certificate: Award,
  enrollment: BookOpen,
};

export function LMSDashboard({ onNavigate }: LMSDashboardProps) {
  // Pick the lowest-progress in-progress course for "Continue Learning".
  const continueCourse = React.useMemo(() => {
    const inProgress = lmsCourses.filter(
      (c) => c.progress > 0 && c.progress < 100
    );
    if (inProgress.length === 0) return lmsCourses[0];
    return [...inProgress].sort((a, b) => a.progress - b.progress)[0];
  }, []);

  const nextLesson = firstIncompleteLesson(continueCourse);

  // Upcoming deadlines — next 3 by due date that aren't graded/submitted.
  const upcomingDeadlines = React.useMemo(() => {
    const today = new Date("2026-11-25");
    return [...lmsAssignments]
      .filter((a) => a.status === "pending" || a.status === "overdue")
      .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
      .slice(0, 3)
      .map((a) => {
        const due = new Date(a.dueDate);
        const days = Math.ceil((+due - +today) / (1000 * 60 * 60 * 24));
        return { ...a, daysLeft: days };
      });
  }, []);

  const stats = [
    {
      label: "Enrolled Courses",
      value: lmsDashboardStats.enrolledCourses,
      icon: BookOpen,
      gradient: "from-[#6366f1] to-[#a855f7]",
    },
    {
      label: "Completed Lessons",
      value: lmsDashboardStats.completedLessons,
      sub: `of ${lmsDashboardStats.totalLessons}`,
      icon: CheckCircle2,
      gradient: "from-[#22d3ee] to-[#6366f1]",
    },
    {
      label: "Average Score",
      value: `${lmsDashboardStats.averageScore}%`,
      icon: TrendingUp,
      gradient: "from-[#f59e0b] to-[#ef4444]",
    },
    {
      label: "Certificates",
      value: lmsDashboardStats.certificatesEarned,
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
              Welcome back, {lmsUser.name.split(" ")[0]}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Pick up where you left off — you&apos;ve learned{" "}
              <span className="text-[var(--text-primary)] font-semibold">
                {lmsDashboardStats.hoursLearned} hours
              </span>{" "}
              across {lmsDashboardStats.enrolledCourses} courses.
            </p>
          </div>
          <AVMButton
            variant="outline"
            onClick={() => onNavigate("student-courses")}
            iconRight={<ArrowRight size={16} />}
          >
            Browse Courses
          </AVMButton>
        </div>
      </Reveal>

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
            {studentInternships.map((si) => (
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
