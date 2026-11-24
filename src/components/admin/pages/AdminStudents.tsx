"use client";

import * as React from "react";
import {
  Users,
  Search,
  Eye,
  Pencil,
  UserCog,
  Ban,
  CheckCircle2,
  UserPlus,
  Phone,
  GraduationCap,
  Check,
  X,
  Clock,
  UserCheck,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { FormField } from "@/components/site/FormField";
import { ProgressBar, StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { mentors, domainOptions } from "@/lib/data";
import {
  getAdminStudentsList,
  saveAdminStudentsList,
  addAdminStudent,
  approveStudentRegistration,
  rejectStudentRegistration,
  deleteAdminStudent,
} from "@/lib/portal-store";
import type { AdminStudent } from "@/lib/data";

type StudentFilterTab = "all" | "Pending" | "Active" | "Suspended" | "Rejected";

export function AdminStudents() {
  const toast = useAVMToast();
  const [query, setQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<StudentFilterTab>("all");
  const [students, setStudents] = React.useState<AdminStudent[]>([]);
  const [viewId, setViewId] = React.useState<string | null>(null);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [assignId, setAssignId] = React.useState<string | null>(null);
  const [addOpen, setAddOpen] = React.useState(false);

  // Load students from store on mount and keep synchronized in real time!
  React.useEffect(() => {
    const sync = () => setStudents(getAdminStudentsList());
    sync();

    if (typeof window !== "undefined") {
      window.addEventListener("avm_store_updated", sync);
      window.addEventListener("storage", sync);
      return () => {
        window.removeEventListener("avm_store_updated", sync);
        window.removeEventListener("storage", sync);
      };
    }
  }, []);

  const pendingCount = React.useMemo(
    () => students.filter((s) => s.status === "Pending").length,
    [students]
  );
  const activeCount = React.useMemo(
    () => students.filter((s) => s.status === "Active").length,
    [students]
  );
  const suspendedCount = React.useMemo(
    () => students.filter((s) => s.status === "Suspended").length,
    [students]
  );
  const rejectedCount = React.useMemo(
    () => students.filter((s) => s.status === "Rejected").length,
    [students]
  );

  const filtered = React.useMemo(() => {
    let list = students;
    if (statusFilter !== "all") {
      list = list.filter((s) => s.status === statusFilter);
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q)
    );
  }, [query, statusFilter, students]);

  const viewStudent = students.find((s) => s.id === viewId) ?? null;
  const editStudent = students.find((s) => s.id === editId) ?? null;
  const assignStudent = students.find((s) => s.id === assignId) ?? null;

  const handleApprove = (student: AdminStudent) => {
    const nextList = approveStudentRegistration(student.id);
    setStudents(nextList);
    toast.success(
      "Registration Approved! 🎉",
      `${student.name}'s account is now Active. They can log in immediately.`
    );
  };

  const handleReject = (student: AdminStudent) => {
    const nextList = rejectStudentRegistration(student.id);
    setStudents(nextList);
    toast.error(
      "Registration Rejected",
      `${student.name}'s registration has been rejected.`
    );
  };

  const handleDeleteStudent = (student: AdminStudent) => {
    if (confirm(`Are you sure you want to delete ${student.name}'s record?`)) {
      const nextList = deleteAdminStudent(student.id);
      setStudents(nextList);
      toast.success("Student Deleted", `${student.name}'s record has been removed.`);
      if (viewId === student.id) setViewId(null);
    }
  };

  const toggleSuspend = (student: AdminStudent) => {
    const nextStatus = student.status === "Suspended" ? "Active" : "Suspended";
    const nextList = students.map((s) =>
      s.id === student.id ? { ...s, status: nextStatus as AdminStudent["status"] } : s
    );
    setStudents(nextList);
    saveAdminStudentsList(nextList);
    toast.success(
      nextStatus === "Active" ? "Student activated" : "Student suspended",
      `${student.name} is now ${nextStatus.toLowerCase()}.`
    );
  };

  const handleSaveEdit = (updated: AdminStudent) => {
    const nextList = students.map((s) => (s.id === updated.id ? updated : s));
    setStudents(nextList);
    saveAdminStudentsList(nextList);
    toast.success("Student updated", `${updated.name}'s record has been saved.`);
    setEditId(null);
  };

  const handleAssignMentor = (mentorName: string) => {
    if (!assignStudent) return;
    const nextList = students.map((s) =>
      s.id === assignStudent.id ? { ...s, mentor: mentorName } : s
    );
    setStudents(nextList);
    saveAdminStudentsList(nextList);
    toast.success("Mentor assigned", `${assignStudent.name} is now mentored by ${mentorName}.`);
    setAssignId(null);
  };

  const handleAddStudent = (data: {
    name: string;
    email: string;
    domain: string;
    mentor: string;
    phone?: string;
    education?: string;
  }) => {
    const newStudent = addAdminStudent(data);
    setStudents((prev) => [newStudent, ...prev]);
    toast.success("Student added", `${newStudent.name} has been enrolled.`);
    setAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
              <Users size={20} />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Students
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {students.length} total • {activeCount} active
                {pendingCount > 0 && (
                  <span className="ml-2 font-semibold text-amber-400">
                    • {pendingCount} awaiting approval
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="relative w-full md:w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search students..."
                aria-label="Search students"
                className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] pl-9 pr-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus:border-[var(--primary)] outline-none transition-colors"
              />
            </div>
            <AVMButton onClick={() => setAddOpen(true)} icon={<UserPlus size={16} />}>
              Add Student
            </AVMButton>
          </div>
        </div>
      </Reveal>

      {/* Filter Tabs */}
      <Reveal>
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--border)] pb-3">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={
              "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors " +
              (statusFilter === "all"
                ? "bg-[var(--primary)] text-white shadow-glow-indigo"
                : "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
            }
          >
            All Students ({students.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("Pending")}
            className={
              "flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors " +
              (statusFilter === "Pending"
                ? "bg-amber-500 text-black shadow-glow-amber font-bold"
                : pendingCount > 0
                ? "border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20"
                : "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
            }
          >
            <Clock size={14} />
            Pending Approval
            {pendingCount > 0 && (
              <span className="ml-1 rounded-full bg-amber-400 px-1.5 py-0.2 text-[10px] font-bold text-black">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("Active")}
            className={
              "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors " +
              (statusFilter === "Active"
                ? "bg-emerald-600 text-white"
                : "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
            }
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("Suspended")}
            className={
              "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors " +
              (statusFilter === "Suspended"
                ? "bg-red-600 text-white"
                : "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
            }
          >
            Suspended ({suspendedCount})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter("Rejected")}
            className={
              "rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-colors " +
              (statusFilter === "Rejected"
                ? "bg-zinc-700 text-white"
                : "border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]")
            }
          >
            Rejected ({rejectedCount})
          </button>
        </div>
      </Reveal>

      {/* Table */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Student</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Domain</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Mentor</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Progress</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text-primary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-[rgba(99,102,241,0.05)] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold text-white">
                          {s.initials}
                        </div>
                        <div>
                          <p className="font-medium text-[var(--text-primary)]">{s.name}</p>
                          <p className="text-xs text-[var(--text-secondary)]">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{s.domain}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{s.mentor}</td>
                    <td className="px-4 py-3">
                      <div className="w-28">
                        <ProgressBar value={s.progress} showLabel />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={s.status}
                        variant={
                          s.status === "Active"
                            ? "success"
                            : s.status === "Pending"
                            ? "warning"
                            : s.status === "Suspended" || s.status === "Rejected"
                            ? "danger"
                            : "info"
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      {s.status === "Pending" ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleApprove(s)}
                            className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors shadow-sm"
                            title="Accept & Approve Student"
                          >
                            <Check size={14} className="stroke-[2.5]" />
                            <span>Approve</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReject(s)}
                            className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 transition-colors"
                            title="Reject Registration"
                          >
                            <X size={14} className="stroke-[2.5]" />
                            <span>Reject</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewId(s.id)}
                            aria-label={`View ${s.name}`}
                            className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--text-primary)]"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(s)}
                            aria-label={`Delete ${s.name}`}
                            className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Student Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => setViewId(s.id)}
                            aria-label={`View ${s.name}`}
                            className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--text-primary)]"
                            title="View Details"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditId(s.id)}
                            aria-label={`Edit ${s.name}`}
                            className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--text-primary)]"
                            title="Edit"
                          >
                            <Pencil size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => setAssignId(s.id)}
                            aria-label={`Assign mentor to ${s.name}`}
                            className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[rgba(99,102,241,0.1)] hover:text-[var(--text-primary)]"
                            title="Assign Mentor"
                          >
                            <UserCog size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={() => toggleSuspend(s)}
                            aria-label={s.status === "Suspended" ? `Activate ${s.name}` : `Suspend ${s.name}`}
                            className={
                              "rounded-lg p-1.5 transition-colors " +
                              (s.status === "Suspended"
                                ? "text-emerald-400 hover:bg-emerald-500/10"
                                : "text-red-400 hover:bg-red-500/10")
                            }
                            title={s.status === "Suspended" ? "Activate" : "Suspend"}
                          >
                            {s.status === "Suspended" ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteStudent(s)}
                            aria-label={`Delete ${s.name}`}
                            className="rounded-lg p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Student Record"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-[var(--text-secondary)]">
                      No students found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* View modal */}
      <Modal
        open={viewStudent !== null}
        onClose={() => setViewId(null)}
        title="Student Details"
        className="max-w-lg"
      >
        {viewStudent && (
          <div className="space-y-4">
            {viewStudent.status === "Pending" && (
              <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-amber-200">
                <div className="flex items-start gap-2.5 text-xs">
                  <Clock size={16} className="shrink-0 text-amber-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-300 text-sm">Awaiting Administrator Approval</p>
                    <p className="text-amber-200/90 mt-1 leading-relaxed">
                      This student registered online and cannot log in until approved. Review their details below and click &quot;Approve &amp; Activate&quot; to grant them LMS access.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-base font-bold text-white">
                {viewStudent.initials}
              </div>
              <div>
                <p className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  {viewStudent.name}
                </p>
                <p className="text-sm text-[var(--text-secondary)]">{viewStudent.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">Domain</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{viewStudent.domain}</p>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">Assigned Mentor</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{viewStudent.mentor}</p>
              </div>
              {viewStudent.phone && (
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
                  <p className="text-xs text-[var(--text-secondary)]">Phone</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{viewStudent.phone}</p>
                </div>
              )}
              {viewStudent.education && (
                <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
                  <p className="text-xs text-[var(--text-secondary)]">Education</p>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">{viewStudent.education}</p>
                </div>
              )}
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">Enrolled On</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {new Date(viewStudent.enrolledOn).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">Status</p>
                <p className="mt-0.5">
                  <StatusBadge
                    status={viewStudent.status}
                    variant={
                      viewStudent.status === "Active"
                        ? "success"
                        : viewStudent.status === "Pending"
                        ? "warning"
                        : viewStudent.status === "Suspended" || viewStudent.status === "Rejected"
                        ? "danger"
                        : "info"
                    }
                  />
                </p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1.5">
                <span>Course Progress</span>
                <span className="font-semibold text-[var(--text-primary)]">{viewStudent.progress}%</span>
              </div>
              <ProgressBar value={viewStudent.progress} showLabel />
            </div>
            <div className="flex items-center justify-between border-t border-[var(--border)] pt-4">
              {viewStudent.status === "Pending" ? (
                <div className="flex items-center gap-2">
                  <AVMButton
                    onClick={() => {
                      handleApprove(viewStudent);
                      setViewId(null);
                    }}
                    icon={<Check size={16} />}
                  >
                    Approve &amp; Activate
                  </AVMButton>
                  <button
                    type="button"
                    onClick={() => {
                      handleReject(viewStudent);
                      setViewId(null);
                    }}
                    className="inline-flex items-center gap-1 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/30 transition-colors"
                  >
                    <X size={15} />
                    Reject
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDeleteStudent(viewStudent)}
                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10 border border-red-500/30 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete Student
                  </button>
                </div>
              )}
              <AVMButton variant="ghost" onClick={() => setViewId(null)}>Close</AVMButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit modal */}
      <EditStudentModal
        student={editStudent}
        onClose={() => setEditId(null)}
        onSave={handleSaveEdit}
      />

      {/* Assign mentor modal */}
      <AssignMentorModal
        student={assignStudent}
        mentors={mentors.map((m) => m.name)}
        onClose={() => setAssignId(null)}
        onAssign={handleAssignMentor}
      />

      {/* Add student modal */}
      <AddStudentModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={handleAddStudent}
      />
    </div>
  );
}

interface EditStudentModalProps {
  student: AdminStudent | null;
  onClose: () => void;
  onSave: (updated: AdminStudent) => void;
}

function EditStudentModal({ student, onClose, onSave }: EditStudentModalProps) {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    domain: "",
    mentor: "",
    progress: 0,
  });
  React.useEffect(() => {
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        domain: student.domain,
        mentor: student.mentor,
        progress: student.progress,
      });
    }
  }, [student]);

  if (!student) return null;

  return (
    <Modal open={student !== null} onClose={onClose} title={`Edit: ${student.name}`} className="max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...student, ...form });
        }}
        className="space-y-4"
      >
        <FormField id="e-name" label="Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <FormField id="e-email" label="Email" inputType="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <FormField id="e-domain" label="Domain" required value={form.domain} onChange={(v) => setForm({ ...form, domain: v })} />
        <FormField id="e-mentor" label="Mentor" required value={form.mentor} onChange={(v) => setForm({ ...form, mentor: v })} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[var(--text-primary)]">Progress (%)</label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.progress}
            onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
            className="h-10 w-full rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--primary)]"
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
          <AVMButton type="button" variant="ghost" onClick={onClose}>Cancel</AVMButton>
          <AVMButton type="submit">Save Changes</AVMButton>
        </div>
      </form>
    </Modal>
  );
}

interface AssignMentorModalProps {
  student: AdminStudent | null;
  mentors: string[];
  onClose: () => void;
  onAssign: (mentorName: string) => void;
}

function AssignMentorModal({ student, mentors, onClose, onAssign }: AssignMentorModalProps) {
  const [selected, setSelected] = React.useState("");
  React.useEffect(() => {
    if (student) setSelected(student.mentor);
  }, [student]);

  if (!student) return null;

  return (
    <Modal open={student !== null} onClose={onClose} title={`Assign Mentor: ${student.name}`} className="max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!selected) return;
          onAssign(selected);
        }}
        className="space-y-4"
      >
        <p className="text-sm text-[var(--text-secondary)]">
          Current mentor: <span className="font-semibold text-[var(--text-primary)]">{student.mentor}</span>
        </p>
        <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
          {mentors.map((m) => (
            <label
              key={m}
              className={
                "flex items-center gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors " +
                (selected === m
                  ? "border-[var(--primary)] bg-[rgba(99,102,241,0.15)]"
                  : "border-[var(--border)] hover:bg-[rgba(99,102,241,0.08)]")
              }
            >
              <input
                type="radio"
                name="mentor"
                value={m}
                checked={selected === m}
                onChange={() => setSelected(m)}
                className="accent-[var(--primary)]"
              />
              <span className="text-sm font-medium text-[var(--text-primary)]">{m}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
          <AVMButton type="button" variant="ghost" onClick={onClose}>Cancel</AVMButton>
          <AVMButton type="submit" disabled={!selected}>Assign</AVMButton>
        </div>
      </form>
    </Modal>
  );
}

interface AddStudentModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    email: string;
    domain: string;
    mentor: string;
    phone?: string;
    education?: string;
  }) => void;
}

function AddStudentModal({ open, onClose, onAdd }: AddStudentModalProps) {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    domain: "MERN Full Stack Development",
    mentor: "Mahendra Cheerla",
    phone: "",
    education: "B.Tech Computer Science",
  });

  const domainOpts = domainOptions.map((d) => ({ value: d.label, label: d.label }));
  const mentorOpts = mentors.map((m) => ({ value: m.name, label: m.name }));

  return (
    <Modal open={open} onClose={onClose} title="Add New Student" className="max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name || !form.email) return;
          onAdd(form);
        }}
        className="space-y-3"
      >
        <FormField id="add-name" label="Full Name" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="e.g. John Doe" />
        <FormField id="add-email" label="Email" inputType="email" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} placeholder="john@example.com" />
        <FormField id="add-phone" label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 90000 00000" />
        <FormField id="add-domain" label="Domain Track" type="select" required value={form.domain} onChange={(v) => setForm({ ...form, domain: v })} options={domainOpts} />
        <FormField id="add-mentor" label="Assign Mentor" type="select" required value={form.mentor} onChange={(v) => setForm({ ...form, mentor: v })} options={mentorOpts} />
        <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
          <AVMButton type="button" variant="ghost" onClick={onClose}>Cancel</AVMButton>
          <AVMButton type="submit">Enroll Student</AVMButton>
        </div>
      </form>
    </Modal>
  );
}
