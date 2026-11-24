"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ------------------------------------------------------------------
 * FormField — label + control + error + helper text.
 * Supports input, textarea, select, and file.
 * ------------------------------------------------------------------ */

type FieldType = "input" | "textarea" | "select" | "file";

interface Option {
  value: string;
  label: string;
}

interface BaseFieldProps {
  id: string;
  label: string;
  type?: FieldType;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  helper?: string;
  required?: boolean;
  className?: string;
  inputType?: string; // for input field: email, tel, text, etc.
  rows?: number; // for textarea
  options?: Option[]; // for select
  accept?: string; // for file
}

export function FormField({
  id,
  label,
  type = "input",
  placeholder,
  value,
  onChange,
  error,
  helper,
  required,
  className,
  inputType = "text",
  rows = 4,
  options = [],
  accept,
}: BaseFieldProps) {
  const hasError = Boolean(error);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-[var(--text-primary)]">
        {label}
        {required && <span className="text-[var(--accent)] ml-0.5">*</span>}
      </Label>

      {type === "input" && (
        <Input
          id={id}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={hasError}
          className="h-11 bg-[var(--bg-base)] border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus-visible:border-[var(--primary)]"
        />
      )}

      {type === "textarea" && (
        <Textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          aria-invalid={hasError}
          rows={rows}
          className="bg-[var(--bg-base)] border-[var(--border)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/70 focus-visible:border-[var(--primary)] resize-y"
        />
      )}

      {type === "select" && (
        <Select value={value} onValueChange={(v) => onChange?.(v)}>
          <SelectTrigger
            id={id}
            aria-invalid={hasError}
            className="h-11 bg-[var(--bg-base)] border-[var(--border)] text-[var(--text-primary)] focus-visible:border-[var(--primary)]"
          >
            <SelectValue placeholder={placeholder ?? "Select..."} />
          </SelectTrigger>
          <SelectContent className="bg-[var(--bg-elevated)] border-[var(--border)] text-[var(--text-primary)] max-h-72">
            {options.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="focus:bg-[rgba(99,102,241,0.2)] focus:text-[var(--text-primary)]"
              >
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {type === "file" && (
        <input
          id={id}
          type="file"
          accept={accept}
          onChange={(e) => onChange?.(e.target.files?.[0]?.name ?? "")}
          aria-invalid={hasError}
          className="h-11 w-full text-sm text-[var(--text-secondary)] file:mr-4 file:rounded-lg file:border-0 file:bg-gradient-primary file:px-4 file:py-2 file:text-white file:font-medium file:cursor-pointer cursor-pointer rounded-md border border-[var(--border)] bg-[var(--bg-base)] px-3"
        />
      )}

      {hasError ? (
        <p className="text-sm text-red-400 mt-0.5">{error}</p>
      ) : helper ? (
        <p className="text-xs text-[var(--text-secondary)]/80 mt-0.5">{helper}</p>
      ) : null}
    </div>
  );
}
