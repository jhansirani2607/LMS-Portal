"use client";

import * as React from "react";
import { ClipboardList, Mail, Eye, Pencil, Users } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { mentors, adminStudents } from "@/lib/data";
import type { Mentor } from "@/lib/data";

export function AdminMentors() {
  const toast = useAVMToast();
  const [viewId, setViewId] = React.useState<string | null>(null);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [assignId, setAssignId] = React.useState<string | null>(null);

  const viewMentor = mentors.find((m) => m.id === viewId) ?? null;
  const editMentor = mentors.find((m) => m.id === editId) ?? null;
  const assignMentor = mentors.find((m) => m.id === assignId) ?? null;

  // Students currently assigned to a mentor
  const studentsForMentor = (name: string) =>
    adminStudents.filter((s) => s.mentor === name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <ClipboardList size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Mentors
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              {mentors.length} mentors • {mentors.filter((m) => m.status === "Active").length} active
            </p>
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
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Mentor</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Expertise</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Students</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text-primary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {mentors.map((m) => (
                  <tr key={m.id} className="hover:bg-[rgba(99,102,241,0.05)]">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-bold text-white">
                          {m.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-[var(--text-primary)] truncate">{m.name}</p>
                          <p className="text-xs text-[var(--text-secondary)] truncate">{m.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] max-w-xs truncate">
                      {m.expertise}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Users size={13} /> {m.assignedStudentsCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={m.status}
                        variant={m.status === "Active" ? "success" : "warning"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setViewId(m.id)}
                          aria-label={`View ${m.name}`}
                          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[rgba(99,102,241,0.12)]"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => setEditId(m.id)}
                          aria-label={`Edit ${m.name}`}
                          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[rgba(99,102,241,0.12)]"
                        >
                          <Pencil size={16} />
                        </button>
                        <AVMButton size="sm" variant="ghost" onClick={() => setAssignId(m.id)}>
                          Assign
                        </AVMButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>

      {/* View modal */}
      <Modal
        open={viewMentor !== null}
        onClose={() => setViewId(null)}
        title="Mentor Details"
        className="max-w-lg"
      >
        {viewMentor && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-primary text-base font-bold text-white">
                {viewMentor.initials}
              </div>
              <div>
                <p className="font-heading text-lg font-semibold text-[var(--text-primary)]">
                  {viewMentor.name}
                </p>
                <p className="text-sm text-[var(--text-secondary)] flex items-center gap-1">
                  <Mail size={13} /> {viewMentor.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">Assigned Students</p>
                <p className="text-sm font-semibold text-[var(--text-primary)]">
                  {viewMentor.assignedStudentsCount}
                </p>
              </div>
              <div className="rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
                <p className="text-xs text-[var(--text-secondary)]">Status</p>
                <p className="mt-0.5">
                  <StatusBadge
                    status={viewMentor.status}
                    variant={viewMentor.status === "Active" ? "success" : "warning"}
                  />
                </p>
              </div>
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)] mb-1">Expertise</p>
              <p className="text-sm text-[var(--text-primary)]">{viewMentor.expertise}</p>
            </div>
            <div className="flex justify-end border-t border-[var(--border)] pt-4">
              <AVMButton variant="ghost" onClick={() => setViewId(null)}>Close</AVMButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit modal (UI only) */}
      <Modal
        open={editMentor !== null}
        onClose={() => setEditId(null)}
        title={editMentor ? `Edit: ${editMentor.name}` : "Edit Mentor"}
        className="max-w-md"
      >
        {editMentor && (
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
              Mentor editing is UI-only in this demo — changes won&apos;t persist to the directory.
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Name</label>
              <input
                defaultValue={editMentor.name}
                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Email</label>
              <input
                defaultValue={editMentor.email}
                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-[var(--text-primary)]">Expertise</label>
              <input
                defaultValue={editMentor.expertise}
                className="h-10 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] px-3 text-sm text-[var(--text-primary)] focus:border-[var(--primary)] outline-none"
              />
            </div>
            <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
              <AVMButton variant="ghost" onClick={() => setEditId(null)}>Cancel</AVMButton>
              <AVMButton
                onClick={() => {
                  toast.success("Saved (UI demo)", "Mentor profile updated locally.");
                  setEditId(null);
                }}
              >
                Save Changes
              </AVMButton>
            </div>
          </div>
        )}
      </Modal>

      {/* Assign students modal */}
      <Modal
        open={assignMentor !== null}
        onClose={() => setAssignId(null)}
        title={assignMentor ? `Assign Students: ${assignMentor.name}` : "Assign Students"}
        className="max-w-lg"
      >
        {assignMentor && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-secondary)]">
              Currently assigned: <span className="font-semibold text-[var(--text-primary)]">
                {assignMentor.assignedStudentsCount}
              </span>{" "}
              students.
            </p>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-3 max-h-80 overflow-y-auto">
              <ul className="flex flex-col gap-2">
                {studentsForMentor(assignMentor.name).length === 0 ? (
                  <li className="text-sm text-[var(--text-secondary)] py-6 text-center">
                    No students currently assigned to this mentor.
                  </li>
                ) : (
                  studentsForMentor(assignMentor.name).map((s) => (
                    <li
                      key={s.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{s.name}</p>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{s.domain}</p>
                      </div>
                      <StatusBadge status={s.status} variant={s.status === "Active" ? "success" : "neutral"} />
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="flex justify-end border-t border-[var(--border)] pt-4">
              <AVMButton variant="ghost" onClick={() => setAssignId(null)}>Close</AVMButton>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
