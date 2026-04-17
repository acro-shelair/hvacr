"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  GripVertical,
  Pencil,
  Trash2,
  Factory,
  Eye,
  EyeOff,
} from "lucide-react";
import { deleteIndustry, reorderIndustries, updateIndustry } from "./actions";
import type { Industry } from "./page";
import Link from "next/link";

export default function IndustriesClient({ industries: initial }: { industries: Industry[] }) {
  const router = useRouter();
  const [industries, setIndustries] = useState(initial);
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
      <div className="text-center py-16 text-zinc-500">
        <Factory className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm mb-4">No industries yet.</p>
        <Link
          href="/admin/industries/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          Add your first industry
        </Link>
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
            className={`rounded-xl border bg-zinc-900 transition-all ${
              isDragging ? "opacity-40" : "opacity-100"
            } ${isDragOver ? "border-accent" : "border-zinc-800"}`}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="shrink-0 cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 transition-colors">
                <GripVertical className="w-4 h-4" />
              </div>

              <div className="shrink-0 w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden flex items-center justify-center">
                {industry.image_url ? (
                  <Image
                    src={industry.image_url}
                    alt={industry.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Factory className="w-5 h-5 text-zinc-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-medium truncate ${
                      industry.is_published ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    {industry.name}
                  </p>
                  {!industry.is_published && (
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate mt-0.5">{industry.slug}</p>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                {isConfirming ? (
                  <>
                    <span className="text-xs text-zinc-400 mr-1 hidden sm:block">Delete?</span>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(industry.id)}
                      disabled={isLoading}
                      className="text-xs text-white bg-destructive hover:bg-destructive/90 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Deleting…" : "Confirm"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleTogglePublished(industry)}
                      disabled={isLoading}
                      title={industry.is_published ? "Unpublish" : "Publish"}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40"
                    >
                      {industry.is_published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      href={`/admin/industries/${industry.id}`}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setConfirmDeleteId(industry.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-destructive hover:bg-zinc-800 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
