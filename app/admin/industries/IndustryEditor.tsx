"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createIndustry, updateIndustry } from "./actions";
import type { Industry } from "./page";

type Props = {
  industry?: Industry;
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
    const path = `${slug || slugify(name)}-${Date.now()}.${ext}`;

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
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      {/* Image */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Image
        </label>
        {imagePreview ? (
          <div className="relative inline-block">
            <div className="w-48 h-32 rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden flex items-center justify-center">
              <Image
                src={imagePreview}
                alt="Image preview"
                width={192}
                height={128}
                className="object-cover w-full h-full"
                unoptimized={imagePreview.startsWith("blob:")}
              />
            </div>
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-zinc-700 hover:bg-destructive text-white flex items-center justify-center transition-colors"
              title="Remove image"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-zinc-700 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300 text-sm transition-colors"
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
            className="mt-2 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            Replace image
          </button>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
          placeholder="e.g. Commercial Refrigeration"
          required
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Slug
        </label>
        <input
          type="text"
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          placeholder="e.g. commercial-refrigeration"
          required
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors font-mono"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Write a short description of this industry…"
          rows={5}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors resize-y"
        />
      </div>

      {/* Publish toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={isPublished}
          onClick={() => setIsPublished((v) => !v)}
          className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
            isPublished ? "bg-accent" : "bg-zinc-700"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
              isPublished ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
        <span className="text-sm text-zinc-300">
          {isPublished ? "Published" : "Draft (hidden from public site)"}
        </span>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-2.5">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving || !name.trim() || !slug.trim()}
          className="px-5 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Industry"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/industries")}
          className="px-5 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
