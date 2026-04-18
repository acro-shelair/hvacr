"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createIndustry, updateIndustry } from "./actions";
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
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(industry?.name ?? "");
  const [slug, setSlug] = useState(industry?.slug ?? "");
  const [description, setDescription] = useState(industry?.description ?? "");
  const [isPublished, setIsPublished] = useState(industry?.is_published ?? true);

  const [imageUrl, setImageUrl] = useState<string | null>(industry?.image_url ?? null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(industry?.image_url ?? null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleNameChange(val: string) {
    setName(val);
    if (!isEdit) setSlug(slugify(val));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    setImageUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function uploadImage(file: File): Promise<string | null> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${slugify(name)}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("industry-images")
      .upload(path, file, { upsert: true });

    if (error) return null;

    const { data } = supabase.storage.from("industry-images").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;

    setSaving(true);
    setError(null);

    let finalImageUrl = imageUrl;

    if (imageFile) {
      const uploaded = await uploadImage(imageFile);
      if (!uploaded) {
        setError("Image upload failed. Please try again.");
        setSaving(false);
        return;
      }
      finalImageUrl = uploaded;
    }

    const fields = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      image_url: finalImageUrl,
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

        {/* Image */}
        <div className="space-y-1.5">
          <Label>Image</Label>
          {imagePreview ? (
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  unoptimized={imagePreview.startsWith("blob:")}
                />
              </div>
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary hover:bg-destructive text-foreground flex items-center justify-center transition-colors border border-border"
                title="Remove image"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground text-sm transition-colors"
            >
              <Upload className="w-4 h-4" />
              Upload image
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {imagePreview && !imageFile && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="mt-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Replace image
            </button>
          )}
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
