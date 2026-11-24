"use client";

import * as React from "react";
import { Briefcase, Plus, Pencil, Users } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { FormField } from "@/components/site/FormField";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { adminInternships, internshipDomains } from "@/lib/data";
import type { AdminInternship } from "@/lib/data";

export function AdminInternships() {
  const toast = useAVMToast();
  const [items, setItems] = React.useState<AdminInternship[]>(adminInternships);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const editItem = items.find((i) => i.id === editId) ?? null;

  const toggleActive = (item: AdminInternship) => {
    setItems((prev) =>
      prev.map((i) => (i.id === item.id ? { ...i, active: !i.active } : i))
    );
    toast.success(
      item.active ? "Internship deactivated" : "Internship activated",
      `${item.title} is now ${item.active ? "inactive" : "active"}.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
              <Briefcase size={20} />
            </div>
            <div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
                Internships
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {items.length} programs • {items.filter((i) => i.active).length} active
              </p>
            </div>
          </div>
          <AVMButton onClick={() => setCreateOpen(true)} icon={<Plus size={16} />}>
            Create New
          </AVMButton>
        </div>
      </Reveal>

      {/* Table */}
      <Reveal>
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Title</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Duration</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Level</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Enrolled</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--text-primary)]">Status</th>
                  <th className="text-right px-4 py-3 font-semibold text-[var(--text-primary)]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {items.map((i) => (
                  <tr key={i.id} className="hover:bg-[rgba(99,102,241,0.05)]">
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{i.title}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{i.duration}</td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{i.level}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-[var(--text-secondary)]">
                        <Users size={13} /> {i.enrolledCount}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={i.active ? "Active" : "Inactive"}
                        variant={i.active ? "success" : "neutral"}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditId(i.id)}
                          aria-label={`Edit ${i.title}`}
                          className="rounded-lg p-1.5 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[rgba(99,102,241,0.12)]"
                        >
                          <Pencil size={16} />
                        </button>
                        <AVMButton
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleActive(i)}
                        >
                          {i.active ? "Deactivate" : "Activate"}
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

      {/* Edit modal */}
      <InternshipFormModal
        item={editItem}
        title={editItem ? `Edit: ${editItem.title}` : "Edit Internship"}
        onClose={() => setEditId(null)}
        onSubmit={(data) => {
          if (!editItem) return;
          setItems((prev) => prev.map((i) => (i.id === editItem.id ? { ...editItem, ...data } : i)));
          toast.success("Internship updated", `${data.title} has been saved.`);
          setEditId(null);
        }}
      />

      {/* Create modal */}
      <InternshipFormModal
        item={null}
        title="Create New Internship"
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => {
          const newItem: AdminInternship = {
            id: `intl-${Date.now()}`,
            title: data.title,
            duration: data.duration,
            level: data.level,
            enrolledCount: 0,
            active: true,
          };
          setItems((prev) => [...prev, newItem]);
          toast.success("Internship created", `${newItem.title} is now live.`);
          setCreateOpen(false);
        }}
      />
    </div>
  );
}

interface InternshipFormModalProps {
  item: AdminInternship | null;
  title: string;
  open?: boolean;
  onClose: () => void;
  onSubmit: (data: { title: string; duration: string; level: string }) => void;
}

function InternshipFormModal({ item, title, open, onClose, onSubmit }: InternshipFormModalProps) {
  const [form, setForm] = React.useState({
    title: "",
    duration: "",
    level: "",
  });
  React.useEffect(() => {
    if (item) {
      setForm({ title: item.title, duration: item.duration, level: item.level });
    } else {
      setForm({ title: "", duration: "", level: "" });
    }
  }, [item]);

  return (
    <Modal open={open ?? item !== null} onClose={onClose} title={title} className="max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title || !form.duration || !form.level) return;
          onSubmit(form);
        }}
        className="space-y-4"
      >
        <FormField id="i-title" label="Title" required value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. MERN Full Stack Development" />
        <FormField id="i-duration" label="Duration" required value={form.duration} onChange={(v) => setForm({ ...form, duration: v })} placeholder="e.g. 12 weeks" />
        <FormField
          id="i-level"
          label="Level"
          type="select"
          required
          value={form.level}
          onChange={(v) => setForm({ ...form, level: v })}
          options={[
            { value: "Beginner", label: "Beginner" },
            { value: "Intermediate", label: "Intermediate" },
            { value: "Advanced", label: "Advanced" },
          ]}
        />
        <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
          <AVMButton type="button" variant="ghost" onClick={onClose}>Cancel</AVMButton>
          <AVMButton type="submit">{item ? "Save Changes" : "Create"}</AVMButton>
        </div>
      </form>
    </Modal>
  );
}
