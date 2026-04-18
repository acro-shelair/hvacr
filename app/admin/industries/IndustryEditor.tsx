"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createIndustry, updateIndustry } from "./actions";
import { ICON_OPTIONS, getIcon } from "./icons";
import type { Industry } from "./page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  industry?: Industry;
  nextPosition?: number;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function IndustryEditor({ industry }: Props) {
  const router = useRouter();
  const isEdit = !!industry;

  const [name, setName] = useState(industry?.name ?? "");
  const [slug, setSlug] = useState(industry?.slug ?? "");
  const [description, setDescription] = useState(industry?.description ?? "");
  const [isPublished, setIsPublished] = useState(industry?.is_published ?? true);
  const [iconName, setIconName] = useState(industry?.icon_name ?? "Building2");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PreviewIcon = getIcon(iconName);

  function handleNameChange(val: string) {
    setName(val);
    if (!isEdit) setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setSaving(true);
    setError(null);

    const fields = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      icon_name: iconName,
      is_published: isPublished,
    };

    if (isEdit) {
      const result = await updateIndustry(industry.id, fields);
      if (result?.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    } else {
      const result = await createIndustry(fields);
      if (result?.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/industries");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-16">
      {/* Actions row */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !name.trim() || !slug.trim()}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Industry"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}

      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">
          Industry Details
        </h2>

        {/* Icon picker */}
        <div className="space-y-3">
          <Label>Icon</Label>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <PreviewIcon className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">
              Selected: <span className="font-medium text-foreground">{iconName}</span>
            </span>
          </div>
          <div className="grid grid-cols-8 gap-2">
            {ICON_OPTIONS.map(({ name: n, icon: Icon }) => (
              <button
                key={n}
                type="button"
                title={n}
                onClick={() => setIconName(n)}
                className={`aspect-square rounded-lg flex items-center justify-center transition-colors border ${
                  iconName === n
                    ? "bg-primary text-white border-primary"
                    : "bg-secondary text-muted-foreground border-transparent hover:border-border hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {/* Name */}
          <div className="space-y-1.5 md:col-span-2">
            <Label>Name</Label>
            <Input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. Healthcare & Hospitals"
              required
            />
          </div>

          {/* Slug */}
          <div className="space-y-1.5 md:col-span-2">
            <Label>Slug</Label>
            <Input
              type="text"
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="healthcare-hospitals"
              required
              className="font-mono"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description of this industry…"
              rows={4}
              className="resize-none"
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
