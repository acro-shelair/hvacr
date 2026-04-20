"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { createService, updateService } from "./actions";
import { SERVICE_ICON_OPTIONS, getServiceIcon } from "@/lib/serviceIcons";
import type { Service } from "./page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProcessStep = { step: string; title: string; description: string };
type Stat = { value: string; label: string };

type Props = {
  service?: Service;
  allServiceSlugs?: { slug: string; title: string }[];
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function ServiceEditor({ service, allServiceSlugs = [] }: Props) {
  const router = useRouter();
  const isEdit = !!service;

  const [slug, setSlug] = useState(service?.slug ?? "");
  const [eyebrow, setEyebrow] = useState(service?.eyebrow ?? "");
  const [title, setTitle] = useState(service?.title ?? "");
  const [heroDescription, setHeroDescription] = useState(service?.hero_description ?? "");
  const [iconName, setIconName] = useState(service?.icon_name ?? "Wrench");
  const [overview, setOverview] = useState(service?.overview ?? "");

  const [features, setFeatures] = useState<string[]>(service?.features ?? [""]);
  const [process, setProcess] = useState<ProcessStep[]>(
    service?.process ?? [{ step: "01", title: "", description: "" }]
  );
  const [stats, setStats] = useState<Stat[]>(service?.stats ?? [{ value: "", label: "" }]);
  const [relatedServices, setRelatedServices] = useState<string[]>(service?.related_services ?? []);

  const [metaTitle, setMetaTitle] = useState(service?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(service?.meta_description ?? "");

  const [ctaEyebrow, setCtaEyebrow] = useState(service?.cta_eyebrow ?? "Ready to Start?");
  const [ctaHeading, setCtaHeading] = useState(service?.cta_heading ?? "Speak to a Trade Specialist Today");
  const [ctaBody, setCtaBody] = useState(service?.cta_body ?? "Get a no-obligation quote for your next project. Our team responds within one business day.");
  const [ctaBtn1Label, setCtaBtn1Label] = useState(service?.cta_btn1_label ?? "Request a Quote");
  const [ctaBtn1Href, setCtaBtn1Href] = useState(service?.cta_btn1_href ?? "/contact");
  const [ctaBtn2Label, setCtaBtn2Label] = useState(service?.cta_btn2_label ?? "1300 227 600");
  const [ctaBtn2Href, setCtaBtn2Href] = useState(service?.cta_btn2_href ?? "tel:1300227600");

  const [isPublished, setIsPublished] = useState(service?.is_published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PreviewIcon = getServiceIcon(iconName);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  // Features helpers
  function updateFeature(i: number, val: string) {
    setFeatures((prev) => prev.map((f, idx) => (idx === i ? val : f)));
  }
  function addFeature() {
    setFeatures((prev) => [...prev, ""]);
  }
  function removeFeature(i: number) {
    setFeatures((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Process helpers
  function updateProcess(i: number, field: keyof ProcessStep, val: string) {
    setProcess((prev) => prev.map((p, idx) => (idx === i ? { ...p, [field]: val } : p)));
  }
  function addProcess() {
    const step = String(process.length + 1).padStart(2, "0");
    setProcess((prev) => [...prev, { step, title: "", description: "" }]);
  }
  function removeProcess(i: number) {
    setProcess((prev) => prev.filter((_, idx) => idx !== i));
  }

  // Stats helpers
  function updateStat(i: number, field: keyof Stat, val: string) {
    setStats((prev) => prev.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  }
  function addStat() {
    setStats((prev) => [...prev, { value: "", label: "" }]);
  }
  function removeStat(i: number) {
    setStats((prev) => prev.filter((_, idx) => idx !== i));
  }

  function toggleRelated(slug: string) {
    setRelatedServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !slug.trim()) return;

    setSaving(true);
    setError(null);

    const fields = {
      slug: slug.trim(),
      eyebrow: eyebrow.trim(),
      title: title.trim(),
      hero_description: heroDescription.trim(),
      icon_name: iconName,
      overview: overview.trim(),
      features: features.filter((f) => f.trim()),
      process: process.filter((p) => p.title.trim()),
      stats: stats.filter((s) => s.value.trim() && s.label.trim()),
      related_services: relatedServices,
      meta_title: metaTitle.trim(),
      meta_description: metaDescription.trim(),
      cta_eyebrow: ctaEyebrow.trim(),
      cta_heading: ctaHeading.trim(),
      cta_body: ctaBody.trim(),
      cta_btn1_label: ctaBtn1Label.trim(),
      cta_btn1_href: ctaBtn1Href.trim(),
      cta_btn2_label: ctaBtn2Label.trim(),
      cta_btn2_href: ctaBtn2Href.trim(),
      is_published: isPublished,
    };

    const result = isEdit
      ? await updateService(service.id, fields)
      : await createService(fields);

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }

    router.push("/admin/services");
    router.refresh();
  }

  const otherServices = allServiceSlugs.filter((s) => s.slug !== slug);

  return (
    <form onSubmit={handleSubmit} className="space-y-10 pb-16">
      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" disabled={saving || !title.trim() || !slug.trim()}>
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Service"}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{error}</p>
      )}

      {/* ── Hero / Identity ──────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Identity</h2>

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
            {SERVICE_ICON_OPTIONS.map(({ name: n, icon: Icon }) => (
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
          <div className="space-y-1.5">
            <Label>Eyebrow label</Label>
            <Input
              value={eyebrow}
              onChange={(e) => setEyebrow(e.target.value)}
              placeholder="e.g. HVAC Installation"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(slugify(e.target.value))}
              placeholder="commercial-air-conditioning"
              required
              className="font-mono"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Title</Label>
            <Input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Commercial Air Conditioning"
              required
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Hero description</Label>
            <Textarea
              value={heroDescription}
              onChange={(e) => setHeroDescription(e.target.value)}
              placeholder="Short description shown in the hero section…"
              rows={3}
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

      {/* ── Overview ─────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">Overview</h2>
        <div className="space-y-1.5">
          <Label>Overview paragraph</Label>
          <Textarea
            value={overview}
            onChange={(e) => setOverview(e.target.value)}
            placeholder="Detailed overview shown in the 'What We Deliver' section…"
            rows={5}
            className="resize-none"
          />
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold border-b border-border pb-2">Features (What&apos;s Included)</h2>
        <div className="space-y-2">
          {features.map((feat, i) => (
            <div key={i} className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground shrink-0" />
              <Input
                value={feat}
                onChange={(e) => updateFeature(i, e.target.value)}
                placeholder={`Feature ${i + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFeature(i)}
                disabled={features.length <= 1}
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addFeature}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Feature
        </Button>
      </section>

      {/* ── Process ──────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold border-b border-border pb-2">Process Steps</h2>
        <div className="space-y-4">
          {process.map((step, i) => (
            <div key={i} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-muted-foreground">Step {i + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeProcess(i)}
                  disabled={process.length <= 1}
                >
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </Button>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Step number</Label>
                  <Input
                    value={step.step}
                    onChange={(e) => updateProcess(i, "step", e.target.value)}
                    placeholder="01"
                    className="font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Title</Label>
                  <Input
                    value={step.title}
                    onChange={(e) => updateProcess(i, "title", e.target.value)}
                    placeholder="e.g. Site Assessment"
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={step.description}
                    onChange={(e) => updateProcess(i, "description", e.target.value)}
                    placeholder="Describe what happens in this step…"
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addProcess}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Step
        </Button>
      </section>

      {/* ── Stats ────────────────────────────────────────── */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold border-b border-border pb-2">Stats Bar</h2>
        <div className="space-y-3">
          {stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Value</Label>
                  <Input
                    value={stat.value}
                    onChange={(e) => updateStat(i, "value", e.target.value)}
                    placeholder="e.g. 50+"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs text-muted-foreground">Label</Label>
                  <Input
                    value={stat.label}
                    onChange={(e) => updateStat(i, "label", e.target.value)}
                    placeholder="e.g. Years combined experience"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeStat(i)}
                disabled={stats.length <= 1}
                className="mt-5"
              >
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addStat}>
          <Plus className="w-4 h-4 mr-1.5" /> Add Stat
        </Button>
      </section>

      {/* ── Related Services ─────────────────────────────── */}
      {otherServices.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold border-b border-border pb-2">Related Services</h2>
          <p className="text-sm text-muted-foreground">Select up to 3 services to show in the related section.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {otherServices.map((s) => {
              const checked = relatedServices.includes(s.slug);
              return (
                <label
                  key={s.slug}
                  className={`flex items-center gap-3 border rounded-lg px-4 py-3 cursor-pointer transition-colors ${
                    checked ? "border-primary bg-primary/5" : "border-border hover:border-muted-foreground"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRelated(s.slug)}
                    className="accent-primary"
                  />
                  <span className="text-sm font-medium">{s.title}</span>
                  <span className="text-xs text-muted-foreground font-mono ml-auto">{s.slug}</span>
                </label>
              );
            })}
          </div>
        </section>
      )}

      {/* ── CTA Banner ───────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">CTA Banner</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label>Eyebrow</Label>
            <Input
              value={ctaEyebrow}
              onChange={(e) => setCtaEyebrow(e.target.value)}
              placeholder="Ready to Start?"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Heading</Label>
            <Input
              value={ctaHeading}
              onChange={(e) => setCtaHeading(e.target.value)}
              placeholder="Speak to a Trade Specialist Today"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Body text</Label>
            <Textarea
              value={ctaBody}
              onChange={(e) => setCtaBody(e.target.value)}
              rows={2}
              className="resize-none"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 border border-border rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider md:col-span-2">
            Primary button
          </p>
          <div className="space-y-1.5">
            <Label>Label</Label>
            <Input
              value={ctaBtn1Label}
              onChange={(e) => setCtaBtn1Label(e.target.value)}
              placeholder="Request a Quote"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Link / href</Label>
            <Input
              value={ctaBtn1Href}
              onChange={(e) => setCtaBtn1Href(e.target.value)}
              placeholder="/contact"
              className="font-mono"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-5 border border-border rounded-lg p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider md:col-span-2">
            Secondary button
          </p>
          <div className="space-y-1.5">
            <Label>Label</Label>
            <Input
              value={ctaBtn2Label}
              onChange={(e) => setCtaBtn2Label(e.target.value)}
              placeholder="1300 227 600"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Link / href</Label>
            <Input
              value={ctaBtn2Href}
              onChange={(e) => setCtaBtn2Href(e.target.value)}
              placeholder="tel:1300227600"
              className="font-mono"
            />
          </div>
        </div>
      </section>

      {/* ── SEO ──────────────────────────────────────────── */}
      <section className="space-y-5">
        <h2 className="text-base font-semibold border-b border-border pb-2">SEO / Meta</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="space-y-1.5 md:col-span-2">
            <Label>Meta title</Label>
            <Input
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Service Name | HVACR Group"
            />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label>Meta description</Label>
            <Textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="160-character summary for search engines…"
              rows={3}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              {metaDescription.length}/160 characters
            </p>
          </div>
        </div>
      </section>
    </form>
  );
}
