"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Video,
  BookOpen,
  FileQuestion,
  Clock,
  Download,
  Play,
  Award,
  User as UserIcon,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { ProgressBar, CourseThumb } from "@/components/lms/LMSUI";
import { getLMSCourse, firstIncompleteLesson } from "@/lib/data";
import type { LMSLesson } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/lib/navigation";

interface LMSCourseViewProps {
  courseId: string;
  onNavigate: NavigateFn;
}

type Tab = "overview" | "curriculum" | "resources";

const lessonTypeIcons: Record<LMSLesson["type"], React.ElementType> = {
  video: Video,
  reading: BookOpen,
  quiz: FileQuestion,
};

export function LMSCourseView({ courseId, onNavigate }: LMSCourseViewProps) {
  const course = getLMSCourse(courseId);
  const [tab, setTab] = React.useState<Tab>("overview");
  const [expandedModules, setExpandedModules] = React.useState<string[]>(() =>
    course ? [course.modules[0]?.id] : []
  );

  if (!course) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
          Course not found
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          The course you&apos;re looking for doesn&apos;t exist.
        </p>
        <AVMButton onClick={() => onNavigate("student-courses")}>
          Back to My Courses
        </AVMButton>
      </div>
    );
  }

  const next = firstIncompleteLesson(course);

  const toggleModule = (id: string) => {
    setExpandedModules((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6">
      {/* Back */}
      <Reveal>
        <button
          onClick={() => onNavigate("student-courses")}
          className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowLeft size={16} /> Back to My Courses
        </button>
      </Reveal>

      {/* Hero */}
      <Reveal>
        <div className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-7">
          <div className="glow-orb top-[-60px] right-[-60px] h-40 w-40 bg-[var(--primary)]" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_220px] gap-6 items-center">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="rounded-full border border-[rgba(99,102,241,0.4)] bg-[rgba(99,102,241,0.12)] px-2.5 py-0.5 text-xs font-semibold text-[#c7d2fe]">
                  {course.category}
                </span>
                <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)]">
                  {course.level}
                </span>
                <span className="rounded-full border border-[var(--border)] px-2.5 py-0.5 text-xs font-semibold text-[var(--text-secondary)]">
                  {course.duration}
                </span>
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                {course.title}
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Instructor:{" "}
                <span className="text-[var(--text-primary)] font-medium">
                  {course.instructor}
                </span>
              </p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
                {course.description}
              </p>
              <div className="flex flex-col gap-2 max-w-md">
                <ProgressBar value={course.progress} showLabel />
                <p className="text-xs text-[var(--text-secondary)]">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
              </div>
              <div className="flex flex-wrap gap-3 mt-2">
                {next ? (
                  <AVMButton
                    size="sm"
                    onClick={() =>
                      onNavigate("student-lesson", {
                        courseId: course.id,
                        lessonId: next.lesson.id,
                      })
                    }
                    icon={<Play size={15} />}
                  >
                    Continue: {next.lesson.title}
                  </AVMButton>
                ) : (
                  <AVMButton
                    size="sm"
                    onClick={() => onNavigate("student-certificates")}
                    icon={<Award size={15} />}
                  >
                    View Certificate
                  </AVMButton>
                )}
              </div>
            </div>

            <div className="hidden lg:block">
              <CourseThumb
                gradient={course.thumbnail}
                category={course.category}
                className="h-32"
              />
            </div>
          </div>
        </div>
      </Reveal>

      {/* Tabs */}
      <Reveal>
        <div className="flex items-center gap-1 border-b border-[var(--border)]">
          {(
            [
              { id: "overview", label: "Overview" },
              { id: "curriculum", label: "Curriculum" },
              { id: "resources", label: "Resources" },
            ] as { id: Tab; label: string }[]
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "relative px-4 py-2.5 text-sm font-medium transition-colors",
                tab === t.id
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              )}
            >
              {t.label}
              {tab === t.id && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 bg-gradient-primary" />
              )}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Tab content */}
      {tab === "overview" && (
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
                <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-3">
                  Course Description
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
                <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-4">
                  What You&apos;ll Learn
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.whatYouWillLearn.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
                    >
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-400"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Instructor card */}
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6 h-fit">
              <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] mb-4">
                Your Instructor
              </h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-primary text-white">
                  <UserIcon size={22} />
                </div>
                <div>
                  <p className="font-semibold text-[var(--text-primary)]">
                    {course.instructor}
                  </p>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Senior Engineer
                  </p>
                </div>
              </div>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                Mentors students through real engineering practices and ships
                production-grade projects alongside the curriculum.
              </p>

              <div className="mt-5 border-t border-[var(--border)] pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Total lessons</span>
                  <span className="text-[var(--text-primary)] font-medium">
                    {course.totalLessons}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Completed</span>
                  <span className="text-[var(--text-primary)] font-medium">
                    {course.completedLessons}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--text-secondary)]">Modules</span>
                  <span className="text-[var(--text-primary)] font-medium">
                    {course.modules.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {tab === "curriculum" && (
        <Reveal>
          <div className="space-y-3">
            {course.modules.map((module, mi) => {
              const expanded = expandedModules.includes(module.id);
              const moduleDone = module.lessons.filter((l) => l.completed).length;
              return (
                <div
                  key={module.id}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden"
                >
                  <button
                    onClick={() => toggleModule(module.id)}
                    className="flex w-full items-center gap-3 px-5 py-4 text-left hover:bg-[rgba(99,102,241,0.06)] transition-colors"
                    aria-expanded={expanded}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-primary text-white text-sm font-bold">
                      {mi + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading text-base font-semibold text-[var(--text-primary)] truncate">
                        {module.title}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {module.lessons.length} lessons • {moduleDone} completed
                      </p>
                    </div>
                    <ChevronDown
                      size={18}
                      className={cn(
                        "text-[var(--text-secondary)] transition-transform shrink-0",
                        expanded && "rotate-180"
                      )}
                    />
                  </button>

                  {expanded && (
                    <ul className="border-t border-[var(--border)] divide-y divide-[var(--border)]">
                      {module.lessons.map((lesson) => {
                        const Icon = lessonTypeIcons[lesson.type];
                        return (
                          <li key={lesson.id}>
                            <button
                              onClick={() =>
                                onNavigate("student-lesson", {
                                  courseId: course.id,
                                  lessonId: lesson.id,
                                })
                              }
                              className="flex w-full items-center gap-3 px-5 py-3 text-left hover:bg-[rgba(99,102,241,0.08)] transition-colors"
                            >
                              <Icon
                                size={16}
                                className={cn(
                                  "shrink-0",
                                  lesson.type === "video"
                                    ? "text-[var(--primary)]"
                                    : lesson.type === "quiz"
                                    ? "text-amber-400"
                                    : "text-[var(--accent)]"
                                )}
                              />
                              <div className="flex-1 min-w-0">
                                <p
                                  className={cn(
                                    "text-sm truncate",
                                    lesson.completed
                                      ? "text-[var(--text-secondary)] line-through"
                                      : "text-[var(--text-primary)] font-medium"
                                  )}
                                >
                                  {lesson.title}
                                </p>
                              </div>
                              <span className="hidden sm:flex items-center gap-1 text-xs text-[var(--text-secondary)] shrink-0">
                                <Clock size={12} /> {lesson.duration}
                              </span>
                              {lesson.completed && (
                                <Check size={16} className="text-emerald-400 shrink-0" />
                              )}
                              {!lesson.completed && (
                                <ArrowRight
                                  size={14}
                                  className="text-[var(--text-secondary)] shrink-0"
                                />
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>
      )}

      {tab === "resources" && (
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
            <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-4">
              Course Resources
            </h3>
            <ul className="flex flex-col gap-3">
              {course.resources.map((r) => (
                <li
                  key={r.name}
                  className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary text-white">
                    <Download size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                      {r.name}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)] uppercase tracking-wide">
                      {r.type}
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      console.log(`Download (sample): ${r.name}`)
                    }
                    className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-hover)]"
                  >
                    Download
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}
    </div>
  );
}
