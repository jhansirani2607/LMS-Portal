"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Video,
  BookOpen,
  FileQuestion,
  Play,
  Download,
  Clock,
  Send,
  MessageSquare,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { ProgressBar } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { getLMSCourse, getLMSLesson, flattenLessons } from "@/lib/data";
import type { LMSLesson } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/lib/navigation";

interface LMSLessonPlayerProps {
  courseId: string;
  lessonId: string;
  onNavigate: NavigateFn;
}

const lessonTypeIcons: Record<LMSLesson["type"], React.ElementType> = {
  video: Video,
  reading: BookOpen,
  quiz: FileQuestion,
};

const lessonTypeLabels: Record<LMSLesson["type"], string> = {
  video: "Video Lesson",
  reading: "Reading",
  quiz: "Quiz",
};

// Sample discussion comments (decorative only).
const SAMPLE_COMMENTS = [
  {
    name: "Meera N.",
    initials: "MN",
    text: "Great explanation — the JVM walkthrough finally made the bytecode concept click for me.",
    timestamp: "3 days ago",
  },
  {
    name: "Arjun R.",
    initials: "AR",
    text: "Quick question: does this apply the same way with GraalVM as the runtime?",
    timestamp: "1 day ago",
  },
  {
    name: "Priya I.",
    initials: "PI",
    text: "Yes — GraalVM is fully JVM-compatible. Worth experimenting with the native-image too.",
    timestamp: "1 day ago",
  },
];

export function LMSLessonPlayer({
  courseId,
  lessonId,
  onNavigate,
}: LMSLessonPlayerProps) {
  const toast = useAVMToast();
  const info = getLMSLesson(courseId, lessonId);
  const [completed, setCompleted] = React.useState<boolean>(
    info?.lesson.completed ?? false
  );
  const [comment, setComment] = React.useState("");

  // Re-sync the local completed state when the lesson changes.
  React.useEffect(() => {
    setCompleted(info?.lesson.completed ?? false);
  }, [lessonId, courseId, info?.lesson.completed]);

  if (!info) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <h2 className="font-heading text-2xl font-bold text-[var(--text-primary)]">
          Lesson not found
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          This lesson doesn&apos;t exist or has been removed.
        </p>
        <AVMButton onClick={() => onNavigate("student-courses")}>
          Back to My Courses
        </AVMButton>
      </div>
    );
  }

  const { course, module, lesson } = info;
  const flat = flattenLessons(course);
  const idx = flat.findIndex((f) => f.lesson.id === lesson.id);
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx < flat.length - 1 ? flat[idx + 1] : null;

  const moduleIndex = course.modules.findIndex((m) => m.id === module.id);

  const completedCount = flat.filter(
    (f) => f.lesson.completed || (f.lesson.id === lesson.id && completed)
  ).length;
  const total = flat.length;
  const progressPct = Math.round((completedCount / total) * 100);

  const Icon = lessonTypeIcons[lesson.type];

  const markComplete = () => {
    if (completed) {
      toast.info("Already completed", "You've marked this lesson as complete.");
      return;
    }
    setCompleted(true);
    toast.success(
      "Lesson marked complete!",
      next ? "Next lesson is now unlocked." : "You've finished the course!"
    );
  };

  const goLesson = (lessonId: string) => {
    onNavigate("student-lesson", { courseId: course.id, lessonId });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }
  };

  const submitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    toast.success("Comment posted", "Your question has been added to the discussion.");
    setComment("");
  };

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <Reveal>
        <nav className="flex flex-wrap items-center gap-1 text-xs text-[var(--text-secondary)]">
          <button
            onClick={() => onNavigate("student-courses")}
            className="hover:text-[var(--text-primary)]"
          >
            My Courses
          </button>
          <ChevronRight size={12} />
          <button
            onClick={() => onNavigate("student-course-view", { courseId: course.id })}
            className="hover:text-[var(--text-primary)] truncate max-w-[160px]"
          >
            {course.title}
          </button>
          <ChevronRight size={12} />
          <span className="text-[var(--text-secondary)] truncate max-w-[140px]">
            {module.title}
          </span>
          <ChevronRight size={12} />
          <span className="text-[var(--text-primary)] font-medium truncate max-w-[180px]">
            {lesson.title}
          </span>
        </nav>
      </Reveal>

      {/* Video area */}
      <Reveal>
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-gradient-to-br from-[#1a2238] via-[#2a1f4d] to-[#3d1a52]">
          <div className="absolute inset-0 bg-grid opacity-20" />
          <div className="glow-orb top-[-40px] left-[-40px] h-40 w-40 bg-[var(--primary)]" />
          <div className="glow-orb bottom-[-40px] right-[-40px] h-40 w-40 bg-[var(--accent)]" />

          <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 text-center px-4">
            <button
              type="button"
              aria-label="Play video"
              className="pulse-ring flex h-16 w-16 items-center justify-center rounded-full bg-white/15 backdrop-blur text-white hover:bg-white/25 transition-colors"
            >
              <Play size={28} className="ml-1" />
            </button>
            <p className="text-sm text-white/80">
              Video content — sample preview
            </p>
            <p className="text-xs text-white/50">
              {lessonTypeLabels[lesson.type]} • {lesson.duration}
            </p>
          </div>
        </div>
      </Reveal>

      {/* Lesson header */}
      <Reveal>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icon size={16} className="text-[var(--primary)]" />
              <span className="text-xs uppercase tracking-[0.15em] text-[var(--text-secondary)]">
                Module {moduleIndex + 1} • {lessonTypeLabels[lesson.type]}
              </span>
            </div>
            <h2 className="font-heading text-xl md:text-2xl font-bold text-[var(--text-primary)]">
              {lesson.title}
            </h2>
            <p className="text-xs text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
              <Clock size={12} /> {lesson.duration}
              {completed && (
                <span className="ml-2 inline-flex items-center gap-1 text-emerald-400 font-semibold">
                  <CheckCircle2 size={13} /> Completed
                </span>
              )}
            </p>
          </div>
          <div className="w-full sm:w-64">
            <ProgressBar value={progressPct} showLabel size="sm" />
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {completedCount} / {total} lessons complete
            </p>
          </div>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lesson content */}
          <Reveal>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
              <h3 className="font-heading text-lg font-semibold text-[var(--text-primary)] mb-3">
                Lesson Content
              </h3>
              <div className="space-y-4 text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">
                <p>{lesson.content}</p>
                <p>
                  This lesson is part of the <span className="text-[var(--text-primary)] font-medium">{module.title}</span>{" "}
                  module in the <span className="text-[var(--text-primary)] font-medium">{course.title}</span> course.
                  Take your time — you can revisit any lesson at any point, and your
                  progress is tracked automatically as you complete each one.
                </p>
                <p>
                  When you&apos;re ready, click <span className="text-[var(--text-primary)] font-medium">&quot;Mark as Complete&quot;</span>{" "}
                  below to unlock the next lesson and update your overall course progress.
                </p>
              </div>
            </div>
          </Reveal>

          {/* Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <Reveal>
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
                <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] mb-3">
                  Resources
                </h3>
                <div className="flex flex-wrap gap-2">
                  {lesson.resources.map((r) => (
                    <span
                      key={r.name}
                      className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 py-1.5 text-xs text-[var(--text-secondary)]"
                    >
                      <Download size={13} className="text-[var(--primary)]" />
                      {r.name}
                      <span className="uppercase text-[10px] tracking-wide text-[var(--text-secondary)]">
                        {r.type}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          {/* Mark complete + prev/next */}
          <Reveal>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
                <AVMButton
                  variant={completed ? "secondary" : "primary"}
                  size="md"
                  onClick={markComplete}
                  icon={completed ? <CheckCircle2 size={16} /> : <Check size={16} />}
                  className="w-full sm:w-auto"
                >
                  {completed ? "Completed" : "Mark as Complete"}
                </AVMButton>

                <div className="flex gap-2 flex-1 sm:justify-end">
                  <AVMButton
                    variant="outline"
                    size="md"
                    onClick={() => prev && goLesson(prev.lesson.id)}
                    disabled={!prev}
                    icon={<ArrowLeft size={16} />}
                    className="flex-1 sm:flex-none"
                  >
                    Prev
                  </AVMButton>
                  <AVMButton
                    variant={completed ? "primary" : "outline"}
                    size="md"
                    onClick={() => next && goLesson(next.lesson.id)}
                    disabled={!next || !completed}
                    iconRight={<ArrowRight size={16} />}
                    className="flex-1 sm:flex-none"
                  >
                    Next Lesson
                  </AVMButton>
                </div>
              </div>
              {!completed && (
                <p className="mt-3 text-xs text-[var(--text-secondary)]">
                  Complete this lesson to unlock the next one.
                </p>
              )}
            </div>
          </Reveal>

          {/* Discussion */}
          <Reveal>
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 md:p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare size={18} className="text-[var(--primary)]" />
                <h3 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                  Discussion
                </h3>
                <span className="text-xs text-[var(--text-secondary)]">
                  ({SAMPLE_COMMENTS.length})
                </span>
              </div>

              <ul className="flex flex-col gap-4 mb-5">
                {SAMPLE_COMMENTS.map((c) => (
                  <li key={c.name + c.timestamp} className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-xs font-bold text-white">
                      {c.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-[var(--text-primary)]">
                          {c.name}
                        </span>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {c.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] mt-0.5 leading-relaxed">
                        {c.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <form onSubmit={submitComment} className="flex flex-col gap-2">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment or ask a question..."
                  aria-label="New comment"
                  rows={3}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors resize-none"
                />
                <div className="flex justify-end">
                  <AVMButton type="submit" size="sm" icon={<Send size={14} />}>
                    Post Comment
                  </AVMButton>
                </div>
              </form>
            </div>
          </Reveal>
        </div>

        {/* Sidebar: lesson list */}
        <Reveal delay={100}>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 h-fit sticky top-20">
            <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] mb-3">
              Course Outline
            </h3>
            <div className="flex flex-col gap-4 max-h-[600px] overflow-y-auto pr-1">
              {course.modules.map((m, mi) => (
                <div key={m.id}>
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--text-secondary)] mb-1.5">
                    {mi + 1}. {m.title}
                  </p>
                  <ul className="flex flex-col gap-1">
                    {m.lessons.map((l) => {
                      const LessonIcon = lessonTypeIcons[l.type];
                      const isCurrent = l.id === lesson.id;
                      const isDone = l.id === lesson.id ? completed : l.completed;
                      return (
                        <li key={l.id}>
                          <button
                            onClick={() => goLesson(l.id)}
                            className={cn(
                              "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
                              isCurrent
                                ? "bg-[rgba(99,102,241,0.15)] text-[var(--text-primary)]"
                                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.08)]"
                            )}
                          >
                            <LessonIcon size={14} className="shrink-0 text-[var(--primary)]" />
                            <span className="flex-1 truncate">{l.title}</span>
                            {isDone && (
                              <Check size={13} className="text-emerald-400 shrink-0" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
