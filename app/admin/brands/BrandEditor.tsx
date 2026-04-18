"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as Icons from "lucide-react";
import { Upload, X, Plus, Trash2, Smile } from "lucide-react";
import { createBrand, updateBrand, uploadBrandLogo } from "./actions";
import type { Brand } from "./page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Props = {
  brand?: Brand;
};

const ICON_OPTIONS = [
  "Wind", "Thermometer", "Snowflake", "Flame", "Droplets", "Zap",
  "Sun", "Cloud", "CloudSnow", "CloudRain", "Wrench", "Settings",
  "Settings2", "Package", "Box", "Shield", "ShieldCheck", "Star",
  "Award", "Building", "Building2", "Factory", "Gauge", "Activity",
  "BarChart2", "TrendingUp", "Globe", "Layers", "Filter", "Timer",
  "Battery", "Plug", "Lightbulb", "Home", "Truck", "Tag", "Users",
  "Cpu", "RefreshCw", "CheckCircle", "Bolt", "Radio", "Store",
  "Hammer", "Drill", "PenTool", "Tool", "CircuitBoard", "Power",
  "MonitorCog", "Webhook", "Server", "HardHat",
] as const;

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Ic = (Icons as Record<string, unknown>)[name] as React.ComponentType<{ className?: string }> | undefined;
  if (!Ic) return null;
  return <Ic className={className} />;
}

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
  const [services, setServices] = useState<string[]>(brand?.services ?? []);
  const [websiteUrl, setWebsiteUrl] = useState(brand?.website_url ?? "");
  const [isPublished, setIsPublished] = useState(brand?.is_published ?? true);
  const [icon, setIcon] = useState<string | null>(brand?.icon ?? null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [iconSearch, setIconSearch] = useState("");

  const [logoUrl, setLogoUrl] = useState<string | null>(brand?.logo_url ?? null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(brand?.logo_url ?? null);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredIcons = ICON_OPTIONS.filter((n) =>
    n.toLowerCase().includes(iconSearch.toLowerCase())
  );

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

  async function toWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        canvas.getContext("2d")!.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Conversion failed"))),
          "image/webp",
          0.9
        );
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async function uploadLogo(file: File): Promise<{ url: string } | { error: string }> {
    const webpBlob = await toWebP(file).catch(() => null);
    if (!webpBlob) return { error: "WebP conversion failed" };

    const formData = new FormData();
    formData.append("file", webpBlob);
    formData.append("path", `${slugify(name)}-${Date.now()}.webp`);

    return uploadBrandLogo(formData);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    setError(null);

    let finalLogoUrl = logoUrl;

    if (logoFile) {
      const result = await uploadLogo(logoFile);
      if ("error" in result) {
        setError(result.error);
        setSaving(false);
        return;
      }
      finalLogoUrl = result.url;
    }

    const fields = {
      name: name.trim(),
      slug: slugify(name.trim()),
      specialty: specialty.trim(),
      description: description.trim(),
      services: services.map((s) => s.trim()).filter(Boolean),
      logo_url: finalLogoUrl,
      icon: icon,
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

        {/* Icon */}
        <div className="space-y-1.5">
          <Label>
            Icon{" "}
            <span className="text-muted-foreground font-normal text-xs">(shown when no logo)</span>
          </Label>

          {icon ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DynamicIcon name={icon} className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm text-muted-foreground">{icon}</span>
              <button
                type="button"
                onClick={() => setIcon(null)}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors"
              >
                Remove
              </button>
              <button
                type="button"
                onClick={() => setShowIconPicker((v) => !v)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Change
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowIconPicker((v) => !v)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground text-sm transition-colors"
            >
              <Smile className="w-4 h-4" />
              {showIconPicker ? "Close picker" : "Pick an icon"}
            </button>
          )}

          {showIconPicker && (
            <div className="border border-border rounded-xl p-4 space-y-3 bg-card">
              <Input
                placeholder="Search icons…"
                value={iconSearch}
                onChange={(e) => setIconSearch(e.target.value)}
                className="h-8 text-sm"
                autoFocus
              />
              <div className="grid grid-cols-8 sm:grid-cols-10 gap-1.5 max-h-52 overflow-y-auto pr-1">
                {filteredIcons.map((name) => (
                  <button
                    key={name}
                    type="button"
                    title={name}
                    onClick={() => {
                      setIcon(name);
                      setShowIconPicker(false);
                      setIconSearch("");
                    }}
                    className={`aspect-square flex items-center justify-center rounded-lg transition-colors hover:bg-primary/10 hover:text-primary ${
                      icon === name ? "bg-primary/15 text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <DynamicIcon name={name} className="w-4 h-4" />
                  </button>
                ))}
                {filteredIcons.length === 0 && (
                  <p className="col-span-full text-xs text-muted-foreground py-4 text-center">
                    No icons match &ldquo;{iconSearch}&rdquo;
                  </p>
                )}
              </div>
            </div>
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

          {/* Services */}
          <div className="space-y-2 md:col-span-2">
            <Label>
              Services{" "}
              <span className="text-muted-foreground font-normal text-xs">(bullet points on site)</span>
            </Label>
            <div className="space-y-2">
              {services.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    value={s}
                    onChange={(e) => {
                      const next = [...services];
                      next[i] = e.target.value;
                      setServices(next);
                    }}
                    placeholder={`Service ${i + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => setServices(services.filter((_, j) => j !== i))}
                    className="shrink-0 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setServices([...services, ""])}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Add service
            </button>
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
