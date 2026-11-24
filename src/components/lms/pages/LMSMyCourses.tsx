"use client";

import * as React from "react";
import {
  Search,
  BookOpen,
  ArrowRight,
  PlusCircle,
  Clock,
  CheckCircle2,
  Sparkles,
  Info,
  ShieldCheck,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { ProgressBar, CourseThumb, StatusBadge } from "@/components/lms/LMSUI";
import { lmsCourses, lmsUser } from "@/lib/data";
import type { LMSCourse, LMSUser } from "@/lib/data";
import { cn } from "@/lib/utils";
import type { NavigateFn } from "@/lib/navigation";
import { useAVMToast } from "@/hooks/use-avm-toast";
import {
  getStudentEnrolledCourses,
  getStudentPendingCourses,
  requestCourseEnrollment,
  type CourseEnrollmentRequest,
} from "@/lib/portal-store";

interface LMSMyCoursesProps {
  onNavigate: NavigateFn;
  user?: LMSUser;
}

const CATEGORIES = [
  "All",
  "Programming",
  "Web Development",
  "AI/ML",
  "Cloud",
  "Design",
  "Mobile",
  "Data",
] as const;
type Category = (typeof CATEGORIES)[number];

export function LMSMyCourses({ onNavigate, user }: LMSMyCoursesProps) {
  const toast = useAVMToast();
  const activeUser = user || lmsUser;

  const [mainTab, setMainTab] = React.useState<"enrolled" | "explore">("enrolled");
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<Category>("All");
  const [selectedCourseForRequest, setSelectedCourseForRequest] = React.useState<LMSCourse | null>(null);
  const [requestNotes, setRequestNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Dynamic store-backed courses and pending requests
  const [enrolledList, setEnrolledList] = React.useState<LMSCourse[]>([]);
  const [pendingList, setPendingList] = React.useState<CourseEnrollmentRequest[]>([]);

  const loadData = React.useCallback(() => {
    const enrolled = getStudentEnrolledCourses(activeUser.email, activeUser.preferredDomain);
    const pending = getStudentPendingCourses(activeUser.email);
    setEnrolledList(enrolled);
    setPendingList(pending);
  }, [activeUser.email, activeUser.preferredDomain]);

  React.useEffect(() => {
    loadData();

    if (typeof window !== "undefined") {
      const handleSync = () => loadData();
      window.addEventListener("avm_store_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        window.removeEventListener("avm_store_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
  }, [loadData]);

  const enrolledCourseIds = React.useMemo(
    () => new Set(enrolledList.map((c) => c.id.toLowerCase())),
    [enrolledList]
  );

  const pendingCourseIds = React.useMemo(
    () => new Set(pendingList.map((p) => p.courseId.toLowerCase())),
    [pendingList]
  );

  // Filter courses based on current mainTab, search query, and category
  const displayedCourses = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const sourceList = mainTab === "enrolled" ? enrolledList : lmsCourses;

    return sourceList.filter((c) => {
      const matchesCat = category === "All" || c.category === category;
      const matchesQuery =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q);
      return matchesCat && matchesQuery;
    });
  }, [mainTab, enrolledList, query, category]);

  const handleEnrollRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourseForRequest) return;

    setIsSubmitting(true);
    const result = requestCourseEnrollment({
      studentEmail: activeUser.email,
      studentName: activeUser.name,
      courseId: selectedCourseForRequest.id,
      courseTitle: selectedCourseForRequest.title,
      category: selectedCourseForRequest.category,
      notes: requestNotes,
    });

    setIsSubmitting(false);

    if (result.success) {
      toast.success("Request Submitted", result.message);
      setSelectedCourseForRequest(null);
      setRequestNotes("");
      loadData();
    } else {
      toast.error("Request Failed", result.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              {mainTab === "enrolled" ? "My Enrolled Courses" : "Explore All Courses"}
            </h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {mainTab === "enrolled"
                ? `${enrolledList.length} course${enrolledList.length === 1 ? "" : "s"} currently active in your learning track.`
                : "Browse the complete course catalog and request enrollment in additional technologies."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:w-64">
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

            <AVMButton
              variant={mainTab === "explore" ? "primary" : "outline"}
              onClick={() => setMainTab(mainTab === "enrolled" ? "explore" : "enrolled")}
              icon={<PlusCircle size={16} />}
            >
              {mainTab === "enrolled" ? "Explore More Courses" : "View My Enrolled Courses"}
            </AVMButton>
          </div>
        </div>
      </Reveal>

      {/* Main Tabs switcher */}
      <Reveal>
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
          <button
            onClick={() => setMainTab("enrolled")}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2",
              mainTab === "enrolled"
                ? "bg-gradient-primary text-white shadow-glow-indigo"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.08)]"
            )}
          >
            <BookOpen size={16} />
            My Enrolled Courses
            <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-white/20 font-bold">
              {enrolledList.length}
            </span>
          </button>

          <button
            onClick={() => setMainTab("explore")}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2",
              mainTab === "explore"
                ? "bg-gradient-primary text-white shadow-glow-indigo"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.08)]"
            )}
          >
            <Sparkles size={16} />
            Course Catalog & New Requests
            {pendingList.length > 0 && (
              <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-amber-500 text-white font-bold animate-pulse">
                {pendingList.length} Pending
              </span>
            )}
          </button>
        </div>
      </Reveal>

      {/* Pending Approval notice banner if student requested another course */}
      {pendingList.length > 0 && (
        <Reveal>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-200 text-sm">
            <div className="flex items-center gap-2.5">
              <Clock size={18} className="text-amber-400 shrink-0" />
              <span>
                You have <strong>{pendingList.length} course enrollment request(s)</strong> awaiting Admin approval:{" "}
                <span className="font-semibold text-white">
                  {pendingList.map((p) => p.courseTitle).join(", ")}
                </span>
                . Once approved by the Admin, the courses will automatically appear under your enrolled courses!
              </span>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 w-fit shrink-0">
              Admin Review in Progress
            </span>
          </div>
        </Reveal>
      )}

      {/* Category Filter chips */}
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
      {displayedCourses.length === 0 ? (
        <Reveal>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-surface)] py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-[var(--text-secondary)]">
              <BookOpen size={26} />
            </div>
            <p className="text-base font-semibold text-[var(--text-primary)]">
              {mainTab === "enrolled"
                ? "No enrolled courses found"
                : "No courses match your filters"}
            </p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              {mainTab === "enrolled"
                ? "Explore our catalog and click 'Request Course' to enroll with Admin approval."
                : "Try clearing your search query or selecting a different category."}
            </p>
            {mainTab === "enrolled" ? (
              <AVMButton
                className="mt-4"
                onClick={() => setMainTab("explore")}
                iconRight={<ArrowRight size={16} />}
              >
                Browse Course Catalog
              </AVMButton>
            ) : (
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
            )}
          </div>
        </Reveal>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedCourses.map((course: LMSCourse, i) => {
            const isEnrolled = enrolledCourseIds.has(course.id.toLowerCase());
            const isPending = pendingCourseIds.has(course.id.toLowerCase());

            return (
              <Reveal key={course.id} delay={i * 60}>
                <CourseCard
                  course={course}
                  isEnrolled={isEnrolled}
                  isPending={isPending}
                  onNavigate={onNavigate}
                  onRequestEnroll={() => setSelectedCourseForRequest(course)}
                />
              </Reveal>
            );
          })}
        </div>
      )}

      {/* Request Course Enrollment Modal */}
      {selectedCourseForRequest && (
        <Modal
          open={Boolean(selectedCourseForRequest)}
          onClose={() => setSelectedCourseForRequest(null)}
          title={`Enroll in ${selectedCourseForRequest.title}`}
          className="max-w-xl"
        >
          <form onSubmit={handleEnrollRequest} className="space-y-5 p-6">
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4 flex gap-4 items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary text-white font-bold shrink-0">
                <BookOpen size={24} />
              </div>
              <div className="min-w-0">
                <h4 className="font-heading text-base font-semibold text-[var(--text-primary)]">
                  {selectedCourseForRequest.title}
                </h4>
                <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                  Instructor: {selectedCourseForRequest.instructor} • Duration: {selectedCourseForRequest.duration} • Level: {selectedCourseForRequest.level}
                </p>
              </div>
            </div>

            <div className="text-sm text-[var(--text-secondary)] space-y-2">
              <p>{selectedCourseForRequest.description}</p>
              <div>
                <p className="text-xs font-semibold text-[var(--text-primary)] uppercase tracking-wide mb-1">
                  What you will learn:
                </p>
                <ul className="list-disc pl-5 text-xs space-y-1">
                  {selectedCourseForRequest.whatYouWillLearn.slice(0, 3).map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-xl border border-sky-500/20 bg-sky-500/10 p-3.5 flex items-start gap-2.5 text-xs text-sky-200">
              <ShieldCheck size={18} className="text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white">Admin Approval Required:</strong> Once you submit this request, the administrator will review your enrollment. As soon as the admin approves, this course and its complete learning modules will be added directly to your profile.
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide mb-1.5">
                Note for Administrator (Optional)
              </label>
              <textarea
                value={requestNotes}
                onChange={(e) => setRequestNotes(e.target.value)}
                placeholder="Reason for taking this additional course (e.g., career interest, upskilling)..."
                rows={3}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus:border-[var(--primary)] outline-none resize-none transition-colors"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <AVMButton
                type="button"
                variant="outline"
                onClick={() => setSelectedCourseForRequest(null)}
              >
                Cancel
              </AVMButton>
              <AVMButton
                type="submit"
                disabled={isSubmitting}
                iconRight={<ArrowRight size={16} />}
              >
                {isSubmitting ? "Submitting..." : "Submit Enrollment Request"}
              </AVMButton>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

interface CourseCardProps {
  course: LMSCourse;
  isEnrolled: boolean;
  isPending: boolean;
  onNavigate: NavigateFn;
  onRequestEnroll: () => void;
}

function CourseCard({
  course,
  isEnrolled,
  isPending,
  onNavigate,
  onRequestEnroll,
}: CourseCardProps) {
  const levelColor =
    course.level === "Beginner"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
      : course.level === "Intermediate"
      ? "bg-amber-500/15 text-amber-300 border-amber-500/30"
      : "bg-red-500/15 text-red-300 border-red-500/30";

  return (
    <div className="card-hover h-full flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-4">
      <div className="relative">
        <CourseThumb gradient={course.thumbnail} category={course.category} />
        {isEnrolled && (
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md">
            <CheckCircle2 size={12} /> Enrolled
          </span>
        )}
        {isPending && !isEnrolled && (
          <span className="absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-0.5 text-[11px] font-bold text-white shadow-md">
            <Clock size={12} /> Pending Approval
          </span>
        )}
      </div>

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
          <span className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-secondary)]">
            {course.category}
          </span>
        </div>

        {isEnrolled ? (
          <div className="flex flex-col gap-1.5 mt-1">
            <ProgressBar value={course.progress} showLabel size="sm" />
            <p className="text-xs text-[var(--text-secondary)]">
              {course.completedLessons} / {course.totalLessons} lessons completed
            </p>
          </div>
        ) : (
          <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-1">
            {course.description}
          </p>
        )}

        <div className="mt-auto pt-2">
          {isEnrolled ? (
            <AVMButton
              size="sm"
              fullWidth
              onClick={() => onNavigate("student-course-view", { courseId: course.id })}
              iconRight={<ArrowRight size={15} />}
            >
              Continue Learning
            </AVMButton>
          ) : isPending ? (
            <AVMButton
              size="sm"
              variant="outline"
              fullWidth
              disabled
              icon={<Clock size={14} className="text-amber-400" />}
            >
              Pending Admin Approval
            </AVMButton>
          ) : (
            <AVMButton
              size="sm"
              variant="outline"
              fullWidth
              onClick={onRequestEnroll}
              icon={<PlusCircle size={14} />}
            >
              Request Enrollment
            </AVMButton>
          )}
        </div>
      </div>
    </div>
  );
}
