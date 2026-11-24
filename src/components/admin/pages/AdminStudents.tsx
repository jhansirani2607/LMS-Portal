"use client";

import * as React from "react";
import { Users, Search, Eye, Pencil, UserCog, Ban, CheckCircle2 } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { FormField } from "@/components/site/FormField";
import { ProgressBar, StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { adminStudents, mentors } from "@/lib/data";
import type { AdminStudent } from "@/lib/data";

export function AdminStudents() {
  const toast = useAVMToast();
  const [query, setQuery] = React.useState("");
  const [students, setStudents] = React.useState<AdminStudent[]>(adminStudents);
  const [viewId, setViewId] = React.useState<string | null>(null);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [assignId, setAssignId] = React.useState<string | null>(null);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.domain.toLowerCase().includes(q)
    );
  }, [query, students]);

  const viewStudent = students.find((s) => s.id === viewId) ?? null;
  const editStudent = students.find((s) => s.id === editId) ?? null;
  const assignStudent = students.find((s) => s.id === assignId) ?? null;

  const toggleSuspend = (student: AdminStudent) => {
    const next = student.status === "Suspended" ? "Active" : "Suspended";
    setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, status: next } : s)));
    toast.success(
      next === "Active" ? "Student activated" : "Student suspended",
      `${student.name} is now ${next.toLowerCase()}.`
    );
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
                {students.length} total • {students.filter((s) => s.status === "Active").length} active
              </p>
            </div>
          </div>
          <div className="relative w-full md:w-72">
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
                  <tr key={s.id} className="hover:bg-[rgba(99,102,241,0.05)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold text-white">
                          {s.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate">{s.name}</p>
                          <p className="text-xs text-[var(--text-secondary)] truncate">{s.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{s.domain}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{s.mentor}</td>
                    <td className="px-4 py-3">
                      <div className="w-24">
                        <ProgressBar value={s.progress} showLabel size="sm" />
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={s.status}
                        variant={
                          s.status === "Active"
                            ? "success"
                            : s.status === "Suspended"
                            ? "danger"
                            : "info"
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewId(s.id)}
                          aria-label={`View ${s.name}`}
                          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[rgba(99,102,241,0.12)]"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditId(s.id)}
                          aria-label={`Edit ${s.name}`}
                          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[rgba(99,102,241,0.12)]"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setAssignId(s.id)}
                          aria-label={`Assign mentor to ${s.name}`}
                          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[rgba(99,102,241,0.12)]"
                        >
                          <UserCog size={16} />
                        </button>
                        <button
                          onClick={() => toggleSuspend(s)}
                          aria-label={s.status === "Suspended" ? "Activate" : "Suspend"}
                          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-red-300 hover:bg-red-500/10"
                        >
                          {s.status === "Suspended" ? <CheckCircle2 size={16} /> : <Ban size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center">
              <Users size={32} className="mx-auto text-[var(--text-secondary)] mb-2" />
              <p className="text-sm text-[var(--text-secondary)]">No students match your search.</p>
            </div>
          )}
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
                <p className="text-xs text-[var(--text-secondary)]">Mentor</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">{viewStudent.mentor}</p>
              </div>
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
                        : viewStudent.status === "Suspended"
                        ? "danger"
                        : "info"
                    }
                  />
                </p>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs text-[var(--text-secondary)] mb-1.5">
                <span>Progress</span>
                <span className="font-semibold text-[var(--text-primary)]">{viewStudent.progress}%</span>
              </div>
              <ProgressBar value={viewStudent.progress} showLabel />
            </div>
            <div className="flex justify-end border-t border-[var(--border)] pt-4">
              <AVMButton variant="ghost" onClick={() => setViewId(null)}>Close</AVMButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit modal */}
      <EditStudentModal
        student={editStudent}
        onClose={() => setEditId(null)}
        onSave={(updated) => {
          setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
          toast.success("Student updated", `${updated.name}'s record has been saved.`);
          setEditId(null);
        }}
      />

      {/* Assign mentor modal */}
      <AssignMentorModal
        student={assignStudent}
        mentors={mentors.map((m) => m.name)}
        onClose={() => setAssignId(null)}
        onAssign={(mentorName) => {
          if (!assignStudent) return;
          setStudents((prev) =>
            prev.map((s) => (s.id === assignStudent.id ? { ...s, mentor: mentorName } : s))
          );
          toast.success("Mentor assigned", `${assignStudent.name} is now mentored by ${mentorName}.`);
          setAssignId(null);
        }}
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
  });
  React.useEffect(() => {
    if (student) {
      setForm({
        name: student.name,
        email: student.email,
        domain: student.domain,
        mentor: student.mentor,
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
