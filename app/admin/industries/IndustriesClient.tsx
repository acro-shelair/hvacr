"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { GripVertical, Pencil, Trash2, Building2, Eye, EyeOff } from "lucide-react";
import { deleteIndustry, reorderIndustries, updateIndustry } from "./actions";
import type { Industry } from "./page";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function IndustriesClient({ initialIndustries }: { initialIndustries: Industry[] }) {
  const router = useRouter();
  const [industries, setIndustries] = useState(initialIndustries);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    await deleteIndustry(id);
    setIndustries((prev) => prev.filter((i) => i.id !== id));
    setConfirmDeleteId(null);
    setLoadingId(null);
    router.refresh();
  }

  async function handleTogglePublished(industry: Industry) {
    setLoadingId(industry.id);
    const next = !industry.is_published;
    setIndustries((prev) =>
      prev.map((i) => (i.id === industry.id ? { ...i, is_published: next } : i))
    );
    await updateIndustry(industry.id, { is_published: next });
    setLoadingId(null);
    router.refresh();
  }

  function handleDragStart(id: string) {
    setDraggingId(id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (id !== draggingId) setDragOverId(id);
  }

  async function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const from = industries.findIndex((i) => i.id === draggingId);
    const to = industries.findIndex((i) => i.id === targetId);
    const reordered = [...industries];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    setIndustries(reordered);
    setDraggingId(null);
    setDragOverId(null);

    await reorderIndustries(reordered.map((i) => i.id));
    router.refresh();
  }

  if (industries.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm mb-4">No industries yet.</p>
        <Button asChild size="sm">
          <Link href="/admin/industries/new">Add your first industry</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {industries.map((industry) => {
        const isConfirming = confirmDeleteId === industry.id;
        const isLoading = loadingId === industry.id;
        const isDragOver = dragOverId === industry.id;
        const isDragging = draggingId === industry.id;

        return (
          <div
            key={industry.id}
            draggable
            onDragStart={() => handleDragStart(industry.id)}
            onDragOver={(e) => handleDragOver(e, industry.id)}
            onDrop={() => handleDrop(industry.id)}
            onDragEnd={() => {
              setDraggingId(null);
              setDragOverId(null);
            }}
            className={`flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4 transition-all ${
              isDragging ? "opacity-40" : "opacity-100"
            } ${isDragOver ? "border-primary" : ""}`}
          >
            <div className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
              <GripVertical className="w-4 h-4" />
            </div>

            <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 overflow-hidden flex items-center justify-center">
              {industry.image_url ? (
                <Image
                  src={industry.image_url}
                  alt={industry.name}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                />
              ) : (
                <Building2 className="w-5 h-5 text-primary" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold truncate ${industry.is_published ? "" : "text-muted-foreground"}`}>
                  {industry.name}
                </p>
                {!industry.is_published && (
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                /{industry.slug}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {isConfirming ? (
                <>
                  <span className="text-xs text-muted-foreground mr-1 hidden sm:block">Delete?</span>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(industry.id)}
                    disabled={isLoading}
                  >
                    {isLoading ? "Deleting…" : "Confirm"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleTogglePublished(industry)}
                    disabled={isLoading}
                    title={industry.is_published ? "Unpublish" : "Publish"}
                  >
                    {industry.is_published ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/industries/${industry.id}/edit`} title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmDeleteId(industry.id)}
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
