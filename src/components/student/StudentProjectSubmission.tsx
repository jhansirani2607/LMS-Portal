"use client";

import * as React from "react";
import {
  Rocket,
  Calendar,
  Upload,
  Send,
  Github,
  ExternalLink,
  Award,
  FileText,
} from "lucide-react";
import { AVMButton } from "@/components/site/AVMButton";
import { Reveal } from "@/components/site/Reveal";
import { Modal } from "@/components/site/Modal";
import { FormField } from "@/components/site/FormField";
import { StatusBadge } from "@/components/lms/LMSUI";
import { useAVMToast } from "@/hooks/use-avm-toast";
import { useFormSubmit } from "@/hooks/use-form-submit";
import { studentProjects, lmsUser } from "@/lib/data";
import type { StudentProject } from "@/lib/data";

interface SubmissionForm {
  projectTitle: string;
  githubUrl: string;
  demoUrl: string;
  description: string;
  fileName: string;
}

const initialForm: SubmissionForm = {
  projectTitle: "",
  githubUrl: "",
  demoUrl: "",
  description: "",
  fileName: "",
};

const statusVariant: Record<StudentProject["status"], "neutral" | "success" | "warning" | "info" | "danger"> = {
  "Not Started": "neutral",
  "In Progress": "info",
  "Submitted": "warning",
  "Reviewed": "success",
};

export function StudentProjectSubmission() {
  const toast = useAVMToast();
  const { submit, loading } = useFormSubmit();
  const [projects, setProjects] = React.useState<StudentProject[]>(studentProjects);
  const [activeProjectId, setActiveProjectId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState<SubmissionForm>(initialForm);

  const activeProject = projects.find((p) => p.id === activeProjectId) ?? null;

  const openSubmit = (project: StudentProject) => {
    setActiveProjectId(project.id);
    setForm({
      projectTitle: project.title,
      githubUrl: "",
      demoUrl: "",
      description: "",
      fileName: "",
    });
  };

  const closeModal = () => {
    setActiveProjectId(null);
    setForm(initialForm);
  };

  const setField = (key: keyof SubmissionForm) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    if (!form.githubUrl.trim()) {
      toast.error("GitHub URL required", "Please provide a link to your repository.");
      return;
    }
    if (!form.description.trim()) {
      toast.error("Description required", "Add a short summary of what you built.");
      return;
    }
    submit(
      {
        studentName: lmsUser.name,
        email: lmsUser.email,
        projectId: activeProject.id,
        projectTitle: form.projectTitle,
        githubUrl: form.githubUrl,
        demoUrl: form.demoUrl,
        description: form.description,
        fileName: form.fileName,
      },
      {
        endpoint: "/api/project-submission",
        successTitle: "Project submitted!",
        successDescription: "Your mentor will review your submission and provide feedback.",
        onSuccess: () => {
          setProjects((prev) =>
            prev.map((p) =>
              p.id === activeProject.id ? { ...p, status: "Submitted" as const } : p
            )
          );
          closeModal();
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Reveal>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-white">
            <Rocket size={20} />
          </div>
          <div>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Project Submission
            </h2>
            <p className="text-sm text-[var(--text-secondary)]">
              Submit your capstone and mini projects for mentor review.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Project list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={i * 60}>
            <div className="card-hover h-full flex flex-col rounded-2xl border border-[var(--border)] bg-[var(--bg-surface)] p-5 gap-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide " +
                        (project.type === "Capstone"
                          ? "border-[var(--primary)]/30 bg-[var(--primary)]/15 text-[var(--primary)]"
                          : "border-[var(--border)] text-[var(--text-secondary)]")
                      }
                    >
                      {project.type}
                    </span>
                  </div>
                  <h3 className="font-heading text-base font-semibold text-[var(--text-primary)] leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                    {project.domainTitle}
                  </p>
                </div>
                <StatusBadge
                  status={project.status}
                  variant={statusVariant[project.status]}
                />
              </div>

              <p className="text-sm text-[var(--text-secondary)] line-clamp-3">
                {project.description}
              </p>

              <div className="flex items-center gap-3 flex-wrap text-xs text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} />
                  Due {new Date(project.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                {project.grade && (
                  <span className="inline-flex items-center gap-1.5 text-emerald-300 font-semibold">
                    <Award size={12} /> Grade: {project.grade}
                  </span>
                )}
              </div>

              <div className="mt-auto pt-1">
                {project.status === "Reviewed" ? (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                    <strong className="font-semibold">Reviewed</strong> — your mentor has
                    evaluated this submission. Final grade: {project.grade ?? "—"}.
                  </div>
                ) : project.status === "Submitted" ? (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-300">
                    <strong className="font-semibold">Awaiting review</strong> — your
                    submission is in your mentor&apos;s queue. You&apos;ll be notified when it&apos;s graded.
                  </div>
                ) : (
                  <AVMButton
                    size="sm"
                    fullWidth
                    onClick={() => openSubmit(project)}
                    icon={<Send size={15} />}
                  >
                    Submit Project
                  </AVMButton>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Submission modal */}
      <Modal
        open={activeProject !== null}
        onClose={closeModal}
        title={activeProject ? `Submit: ${activeProject.title}` : "Submit Project"}
        className="max-w-xl"
      >
        {activeProject && (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-base)] p-4">
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                {activeProject.description}
              </p>
              <div className="mt-3 flex items-center gap-3 flex-wrap text-xs text-[var(--text-secondary)]">
                <span className="inline-flex items-center gap-1">
                  <FileText size={12} /> {activeProject.type}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar size={12} />
                  Due {new Date(activeProject.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>

            <FormField
              id="projectTitle"
              label="Project Title"
              required
              value={form.projectTitle}
              onChange={setField("projectTitle")}
              placeholder="e.g. Full-Stack Task Management SaaS"
            />

            <FormField
              id="githubUrl"
              label="GitHub Repository URL"
              required
              value={form.githubUrl}
              onChange={setField("githubUrl")}
              placeholder="https://github.com/username/repo"
              helper="Public repo link — your mentor will review the code."
            />

            <FormField
              id="demoUrl"
              label="Live Demo URL (optional)"
              value={form.demoUrl}
              onChange={setField("demoUrl")}
              placeholder="https://your-app.vercel.app"
            />

            <FormField
              id="description"
              label="Description"
              type="textarea"
              required
              rows={4}
              value={form.description}
              onChange={setField("description")}
              placeholder="Describe what you built, key features, tech stack used, and any setup instructions..."
            />

            <FormField
              id="fileName"
              label="Attach file (optional)"
              type="file"
              accept=".pdf,.zip,.docx"
              value={form.fileName}
              onChange={setField("fileName")}
              helper="Upload a README, design doc or zip of source (UI only)."
            />

            {/* Preview links */}
            {(form.githubUrl || form.demoUrl) && (
              <div className="flex flex-wrap gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-base)] p-3">
                {form.githubUrl && (
                  <a
                    href={form.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
                  >
                    <Github size={12} /> View repo
                  </a>
                )}
                {form.demoUrl && (
                  <a
                    href={form.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--primary)] hover:underline"
                  >
                    <ExternalLink size={12} /> View demo
                  </a>
                )}
              </div>
            )}

            <div className="flex justify-end gap-2 border-t border-[var(--border)] pt-4">
              <AVMButton variant="ghost" size="md" onClick={closeModal}>
                Cancel
              </AVMButton>
              <AVMButton
                type="submit"
                size="md"
                disabled={loading}
                icon={loading ? undefined : <Upload size={15} />}
              >
                {loading ? "Submitting..." : "Submit Project"}
              </AVMButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}
