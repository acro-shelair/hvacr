"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { createBrand, updateBrand } from "./actions";
import type { Brand } from "./page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  brand?: Brand;
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function BrandEditor({ brand }: Props) {
  const router = useRouter();
  const isEdit = !!brand;
  const fileRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(brand?.name ?? "");
  const [specialty, setSpecialty] = useState(brand?.specialty ?? "");
  const [description, setDescription] = useState(brand?.description ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(brand?.website_url ?? "");
  const [isPublished, setIsPublished] = useState(brand?.is_published ?? true);

  const [logoUrl, setLogoUrl] = useState<string | null>(brand?.logo_url ?? null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(brand?.logo_url ?? null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
  }

  function clearLogo() {
    setLogoFile(null);
    setLogoPreview(null);
    setLogoUrl(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function uploadLogo(file: File): Promise<string | null> {
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${slugify(name)}-${Date.now()}.${ext}`;

    const { error } = await supabase.storage
      .from("brand-logos")
      .upload(path, file, { upsert: true });

    if (error) return null;

    const { data } = supabase.storage.from("brand-logos").getPublicUrl(path);
    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);

    let finalLogoUrl = logoUrl;

    if (logoFile) {
      const uploaded = await uploadLogo(logoFile);
      if (!uploaded) {
        setError("Image upload failed. Please try again.");
        setSaving(false);
        return;
      }
      finalLogoUrl = uploaded;
    }

    const fields = {
      name: name.trim(),
      specialty: specialty.trim(),
      description: description.trim(),
      logo_url: finalLogoUrl,
      website_url: websiteUrl.trim() || null,
      is_published: isPublished,
    };

    if (isEdit) {
      const result = await updateBrand(brand.id, fields);
      if (result?.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    } else {
      const result = await createBrand(fields);
      if (result?.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/brands");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-16">
      {/* Actions row */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !name.trim()}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Brand"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}

      {/* ── Core fields ──────────────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Brand Details</h2>

        {/* Logo */}
        <div className="space-y-1.5">
          <Label>Logo</Label>
          {logoPreview ? (
            <div className="relative inline-block">
              <div className="w-32 h-32 rounded-xl bg-secondary border border-border overflow-hidden flex items-center justify-center">
                <Image
                  src={logoPreview}
                  alt="Logo preview"
                  width={128}
                  height={128}
                  className="object-contain w-full h-full p-2"
                  unoptimized={logoPreview.startsWith("blob:")}
                />
              </div>
              <button
                type="button"
                onClick={clearLogo}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-secondary hover:bg-destructive text-foreground flex items-center justify-center transition-colors border border-border"
                title="Remove logo"
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
              Upload logo
            </button>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          {logoPreview && !logoFile && (
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
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Daikin"
              required
            />
          </div>

          {/* Specialty */}
          <div className="space-y-1.5 md:col-span-2">
            <Label>
              Specialty{" "}
              <span className="text-muted-foreground font-normal text-xs">(subtitle)</span>
            </Label>
            <Input
              type="text"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              placeholder="e.g. Commercial & Industrial HVAC"
            />
          </div>

          {/* Redirect Link */}
          <div className="space-y-1.5 md:col-span-2">
            <Label>
              Redirect Link{" "}
              <span className="text-muted-foreground font-normal text-xs">(optional)</span>
            </Label>
            <Input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              placeholder="https://domain.com.au"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description of this brand…"
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
