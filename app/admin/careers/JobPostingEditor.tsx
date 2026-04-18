"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createJobPosting, updateJobPosting } from "./actions";
import type { JobPosting } from "./page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Casual", "Apprenticeship"] as const;

type Props = {
  posting?: JobPosting;
};

export default function JobPostingEditor({ posting }: Props) {
  const router = useRouter();
  const isEdit = !!posting;

  const [title, setTitle] = useState(posting?.title ?? "");
  const [location, setLocation] = useState(posting?.location ?? "");
  const [employmentType, setEmploymentType] = useState(
    posting?.employment_type ?? "Full-time"
  );
  const [description, setDescription] = useState(posting?.description ?? "");
  const [isPublished, setIsPublished] = useState(posting?.is_published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !description.trim()) return;

    setSaving(true);
    setError(null);

    const fields = {
      title: title.trim(),
      location: location.trim(),
      employment_type: employmentType,
      description: description.trim(),
    };

    if (isEdit) {
      const result = await updateJobPosting(posting.id, { ...fields, is_published: isPublished });
      if (result?.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    } else {
      const result = await createJobPosting(fields);
      if (result?.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/careers");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-16">
      {/* Actions row */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={saving || !title.trim() || !location.trim() || !description.trim()}
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Job Posting"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}

      {/* ── Job Details ──────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Job Details</h2>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Title */}
          <div className="space-y-1.5 md:col-span-2">
            <Label>Job Title</Label>
            <Input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Refrigeration Technician"
              required
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label>Location</Label>
            <Input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Brisbane, QLD"
              required
            />
          </div>

          {/* Employment Type */}
          <div className="space-y-1.5">
            <Label>Employment Type</Label>
            <Select value={employmentType} onValueChange={setEmploymentType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EMPLOYMENT_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the role, responsibilities, and requirements…"
              required
              rows={10}
              className="resize-y"
            />
          </div>
        </div>

        {/* Publish toggle */}
        <div className="flex items-center gap-3 pt-1">
          <button
            type="button"
            role="switch"
            aria-checked={isPublished}
            onClick={() => setIsPublished((v) => !v)}
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
              isPublished ? "bg-primary" : "bg-secondary"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                isPublished ? "translate-x-4" : "translate-x-0"
              }`}
            />
          </button>
          <span className="text-sm text-muted-foreground">
            {isPublished ? "Published" : "Draft (hidden from public site)"}
          </span>
        </div>
      </section>
    </form>
  );
}
