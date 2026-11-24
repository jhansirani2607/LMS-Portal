"use client";

import * as React from "react";
import {
  BookOpen,
  Plus,
  Pencil,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  AlertCircle,
  FileText,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { FormField } from "@/components/site/FormField";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { adminCourses } from "@/lib/data";
import type { AdminCourse } from "@/lib/data";
import {
  getCourseEnrollmentRequests,
  approveCourseEnrollment,
  rejectCourseEnrollment,
  type CourseEnrollmentRequest,
} from "@/lib/portal-store";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS = [
  { value: "Programming", label: "Programming" },
  { value: "Web Development", label: "Web Development" },
  { value: "AI/ML", label: "AI/ML" },
  { value: "Cloud", label: "Cloud" },
  { value: "Mobile", label: "Mobile" },
  { value: "Design", label: "Design" },
  { value: "Data", label: "Data" },
];

export function AdminCourses() {
  const toast = useAVMToast();
  const [activeTab, setActiveTab] = React.useState<"courses" | "requests">("courses");
  const [items, setItems] = React.useState<AdminCourse[]>(adminCourses);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  // Real-time course enrollment requests from students
  const [requests, setRequests] = React.useState<CourseEnrollmentRequest[]>([]);

  const loadRequests = React.useCallback(() => {
    setRequests(getCourseEnrollmentRequests());
  }, []);

  React.useEffect(() => {
    loadRequests();

    if (typeof window !== "undefined") {
      const handleSync = () => loadRequests();
      window.addEventListener("avm_store_updated", handleSync);
      window.addEventListener("storage", handleSync);
      return () => {
        window.removeEventListener("avm_store_updated", handleSync);
        window.removeEventListener("storage", handleSync);
      };
    }
  }, [loadRequests]);

  const pendingRequests = React.useMemo(
    () => requests.filter((r) => r.status === "Pending"),
    [requests]
  );

  const editItem = items.find((c) => c.id === editId) ?? null;

  const handleApprove = (req: CourseEnrollmentRequest) => {
    const updated = approveCourseEnrollment(req.id);
    setRequests(updated);
    toast.success(
      "Enrollment Approved!",
      `Course "${req.courseTitle}" has been approved for ${req.studentName} (${req.studentEmail}).`
    );
  };

  const handleReject = (req: CourseEnrollmentRequest) => {
    const updated = rejectCourseEnrollment(req.id);
    setRequests(updated);
    toast.error(
      "Enrollment Rejected",
      `Course "${req.courseTitle}" request for ${req.studentName} was rejected.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Course Management & Approvals
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {items.length} courses cataloged • {pendingRequests.length} student request(s) awaiting review.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <AVMButton onClick={() => setCreateOpen(true)} icon={<Plus size={16} />}>
              Create Course
            </AVMButton>
          </div>
        </div>
      </Reveal>

      {/* Pending requests alert banner */}
      {pendingRequests.length > 0 && (
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-transparent p-4 text-amber-200 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <Clock size={20} />
              </div>
              <div>
                <p className="font-heading text-base font-semibold text-white">
                  {pendingRequests.length} Course Enrollment Request{pendingRequests.length > 1 ? "s" : ""} Pending Review
                </p>
                <p className="text-xs text-amber-200/80 mt-0.5">
                  Logged-in students requested enrollment into additional courses. Approve to grant instant LMS access.
                </p>
              </div>
            </div>
            <AVMButton
              size="sm"
              variant="outline"
              className="border-amber-400/40 text-amber-200 hover:bg-amber-500/20 shrink-0"
              onClick={() => setActiveTab("requests")}
            >
              Review Requests Now
            </AVMButton>
          </div>
        </Reveal>
      )}

      {/* Sub tabs */}
      <Reveal>
        <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
          <button
            onClick={() => setActiveTab("courses")}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2",
              activeTab === "courses"
                ? "bg-gradient-primary text-white shadow-glow-indigo"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.08)]"
            )}
          >
            <BookOpen size={16} />
            Course Catalog
            <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-white/20 font-bold">
              {items.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("requests")}
            className={cn(
              "px-4 py-2 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2",
              activeTab === "requests"
                ? "bg-gradient-primary text-white shadow-glow-indigo"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[rgba(99,102,241,0.08)]"
            )}
          >
            <Clock size={16} />
            Student Course Requests
            {pendingRequests.length > 0 && (
              <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-amber-500 text-white font-bold animate-pulse">
                {pendingRequests.length} Pending
              </span>
            )}
          </button>
        </div>
      </Reveal>

      {/* Tab 1: Course Catalog */}
      {activeTab === "courses" && (
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                    <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Title</th>
                    <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Category</th>
                    <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Lessons</th>
                    <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Enrolled</th>
                    <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Status</th>
                    <th className="text-right px-4 py-3 font-semibold text-[var(--text-primary)]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {items.map((c) => (
                    <tr key={c.id} className="hover:bg-[rgba(99,102,241,0.05)]">
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{c.title}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{c.category}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{c.lessonsCount}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                          <Users size={13} /> {c.enrolledCount}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge
                          status={c.status}
                          variant={c.status === "Published" ? "success" : "neutral"}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditId(c.id)}
                            aria-label={`Edit ${c.title}`}
                            className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[rgba(99,102,241,0.12)]"
                          >
                            <Pencil size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>
      )}

      {/* Tab 2: Student Course Enrollment Requests */}
      {activeTab === "requests" && (
        <Reveal>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
            {requests.length === 0 ? (
              <div className="py-16 text-center text-[var(--text-secondary)]">
                <BookOpen size={36} className="mx-auto mb-2 opacity-50" />
                <p className="text-base font-semibold text-[var(--text-primary)]">
                  No Course Requests Yet
                </p>
                <p className="text-xs mt-1">
                  When existing students request enrollment in additional courses, they will appear here for your approval.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                      <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Student</th>
                      <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Requested Course</th>
                      <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Category</th>
                      <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Requested Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Notes</th>
                      <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-[var(--text-primary)]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {requests.map((r) => (
                      <tr key={r.id} className="hover:bg-[rgba(99,102,241,0.05)]">
                        <td className="px-4 py-3">
                          <p className="font-semibold text-[var(--text-primary)]">{r.studentName}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{r.studentEmail}</p>
                        </td>
                        <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                          {r.courseTitle}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                          {r.category}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                          {r.requestedDate}
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)] max-w-xs truncate">
                          {r.notes || "—"}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge
                            status={r.status}
                            variant={
                              r.status === "Approved"
                                ? "success"
                                : r.status === "Pending"
                                ? "warning"
                                : "danger"
                            }
                          />
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {r.status === "Pending" ? (
                              <>
                                <button
                                  onClick={() => handleApprove(r)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-colors"
                                  title="Approve Course Enrollment"
                                >
                                  <Check size={14} /> Approve
                                </button>
                                <button
                                  onClick={() => handleReject(r)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/15 text-rose-300 hover:bg-rose-500/25 border border-rose-500/30 transition-colors"
                                  title="Reject Request"
                                >
                                  <X size={14} /> Reject
                                </button>
                              </>
                            ) : r.status === "Approved" ? (
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-medium">
                                <CheckCircle2 size={14} /> Active Course
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApprove(r)}
                                className="text-xs text-[var(--text-secondary)] hover:text-white underline underline-offset-2"
                              >
                                Re-approve
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Reveal>
      )}

      {/* Edit modal */}
      <CourseFormModal
        item={editItem}
        title={editItem ? `Edit: ${editItem.title}` : "Edit Course"}
        onClose={() => setEditId(null)}
        onSubmit={(data) => {
          if (!editItem) return;
          setItems((prev) => prev.map((c) => (c.id === editItem.id ? { ...editItem, ...data } : c)));
          toast.success("Course updated", `${data.title} has been saved.`);
          setEditId(null);
        }}
      />

      {/* Create modal */}
      <CourseFormModal
        item={null}
        title="Create New Course"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => {
          const newItem: AdminCourse = {
            id: `c-${Date.now()}`,
            title: data.title,
            category: data.category,
            lessonsCount: Number(data.lessonsCount) || 0,
            enrolledCount: 0,
            status: data.status as "Published" | "Draft",
          };
          setItems((prev) => [...prev, newItem]);
          toast.success("Course created", `${newItem.title} is now in the catalog.`);
          setCreateOpen(false);
        }}
      />
    </div>
  );
}

interface CourseFormModalProps {
  item: AdminCourse | null;
  title: string;
  open?: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; category: string; lessonsCount: string; status: string }) => void;
}

function CourseFormModal({ item, title, open, onClose, onSubmit }: CourseFormModalProps) {
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState("Programming");
  const [lessons, setLessons] = React.useState("10");
  const [status, setStatus] = React.useState("Published");

  React.useEffect(() => {
    if (item) {
      setName(item.title);
      setCategory(item.category);
      setLessons(String(item.lessonsCount));
      setStatus(item.status);
    } else {
      setName("");
      setCategory("Programming");
      setLessons("10");
      setStatus("Published");
    }
  }, [item, open]);

  const isOpen = Boolean(item) || Boolean(open);

  return (
    <Modal open={isOpen} onClose={onClose} title={title}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({ title: name, category, lessonsCount: lessons, status });
        }}
        className="space-y-4 p-6"
      >
        <FormField
          label="Course Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <FormField
          label="Category"
          type="select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={CATEGORY_OPTIONS}
        />
        <FormField
          label="Lessons Count"
          type="number"
          value={lessons}
          onChange={(e) => setLessons(e.target.value)}
        />
        <FormField
          label="Status"
          type="select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          options={[
            { value: "Published", label: "Published" },
            { value: "Draft", label: "Draft" },
          ]}
        />
        <div className="flex justify-end gap-2 pt-2">
          <AVMButton variant="outline" onClick={onClose} type="button">
            Cancel
          </AVMButton>
          <AVMButton type="submit">Save Course</AVMButton>
        </div>
      </form>
    </Modal>
  );
}
