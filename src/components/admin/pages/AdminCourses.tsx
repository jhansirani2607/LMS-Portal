"use client";

import * as React from "react";
import { BookOpen, Plus, Pencil, Users } from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { FormField } from "@/components/site/FormField";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { adminCourses } from "@/lib/data";
import type { AdminCourse } from "@/lib/data";

const CATEGORY_OPTIONS = [
  { value: "Programming", label: "Programming" },
  { value: "Web Development", label: "Web Development" },
  { value: "AI/ML", label: "AI/ML" },
  { value: "Cloud", label: "Cloud" },
  { value: "Mobile", label: "Mobile" },
  { value: "Design", label: "Design" },
];

export function AdminCourses() {
  const toast = useAVMToast();
  const [items, setItems] = React.useState<AdminCourse[]>(adminCourses);
  const [editId, setEditId] = React.useState<string | null>(null);
  const [createOpen, setCreateOpen] = React.useState(false);

  const editItem = items.find((c) => c.id === editId) ?? null;

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
                Courses
              </h2>
              <p className="text-sm text-[var(--text-secondary)]">
                {items.length} courses • {items.filter((c) => c.status === "Published").length} published
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
  const [form, setForm] = React.useState({
    title: "",
    category: "",
    lessonsCount: "",
    status: "Draft",
  });
  React.useEffect(() => {
    if (item) {
      setForm({
        title: item.title,
        category: item.category,
        lessonsCount: String(item.lessonsCount),
        status: item.status,
      });
    } else {
      setForm({ title: "", category: "", lessonsCount: "", status: "Draft" });
    }
  }, [item]);

  return (
    <Modal open={open ?? item !== null} onClose={onClose} title={title} className="max-w-md">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.title || !form.category) return;
          onSubmit(form);
        }}
        className="space-y-4"
      >
        <FormField id="c-title" label="Title" required value={form.title} onChange={(v) => setForm({ ...form, title: v })} placeholder="e.g. Advanced React Patterns" />
        <FormField id="c-category" label="Category" type="select" required value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={CATEGORY_OPTIONS} />
        <FormField id="c-lessons" label="Lessons Count" inputType="number" value={form.lessonsCount} onChange={(v) => setForm({ ...form, lessonsCount: v })} placeholder="e.g. 12" />
        <FormField
          id="c-status"
          label="Status"
          type="select"
          value={form.status}
          onChange={(v) => setForm({ ...form, status: v })}
          options={[
            { value: "Draft", label: "Draft" },
            { value: "Published", label: "Published" },
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
