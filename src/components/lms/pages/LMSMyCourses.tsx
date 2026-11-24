"use client";

import * as React from "react";
import { Search, BookOpen, ArrowRight } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { ProgressBar, CourseThumb } from "@/components/lms/LMSUI";
import { lmsCourses } from "@/lib/data";
import type { LMSCourse } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/lib/navigation";

interface LMSMyCoursesProps {
  onNavigate: NavigateFn;
}

const CATEGORIES = ["All", "Programming", "Web Development", "AI/ML"] as const;
type Category = (typeof CATEGORIES)[number];

export function LMSMyCourses({ onNavigate }: LMSMyCoursesProps) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<Category>("All");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return lmsCourses.filter((c) => {
      const matchesCat = category === "All" || c.category === category;
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [query, category]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              My Courses
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {lmsCourses.length} enrolled courses — pick up where you left off.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
            />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses..."
              aria-label="Search courses"
              className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors"
            />
          </div>
        </div>
      </Reveal>

      {/* Filter chips */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium border transition-colors",
                category === cat
                  ? "bg-gradient-primary text-white border-transparent shadow-glow-indigo"
                  : "border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.1)]"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </Reveal>

      {/* Grid */}
      {filtered.length === 0 ? (
        <Reveal>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
              <BookOpen size={26} />
            </div>
            <p className="text-base font-semibold text-[var(--text-primary)]">
              No courses match your filters
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Try clearing the search or selecting a different category.
            </p>
            <AVMButton
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => {
                setQuery("");
                setCategory("All");
              }}
            >
              Reset filters
            </AVMButton>
          </div>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((course: LMSCourse, i) => (
            <Reveal key={course.id} delay={i * 70}>
              <CourseCard course={course} onNavigate={onNavigate} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

interface CourseCardProps {
  course: LMSCourse;
  onNavigate: NavigateFn;
}

function CourseCard({ course, onNavigate }: CourseCardProps) {
  const levelColor =
    course.level === "Beginner"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : course.level === "Intermediate"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
      : "bg-red-500/15 text-red-300 border-red-500/30";

  return (
    <div className="card-hover h-full flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <CourseThumb gradient={course.thumbnail} category={course.category} />

      <div className="mt-4 flex flex-col flex-1 gap-3">
        <div>
          <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] leading-snug">
            {course.title}
          </h3>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">
            Instructor: {course.instructor}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em]",
              levelColor
            )}
          >
            {course.level}
          </span>
          <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
            {course.duration}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <ProgressBar value={course.progress} showLabel size="sm" />
          <p className="text-xs text-[var(--text-secondary)]">
            {course.completedLessons} / {course.totalLessons} lessons
          </p>
        </div>

        <div className="mt-auto pt-2">
          <AVMButton
            size="sm"
            fullWidth
            onClick={() => onNavigate("student-course-view", { courseId: course.id })}
            iconRight={<ArrowRight size={15} />}
          >
            Continue Learning
          </AVMButton>
        </div>
      </div>
    </div>
  );
}
