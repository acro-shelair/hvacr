"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  GripVertical,
  Pencil,
  Trash2,
  HelpCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { deleteFaq, reorderFaqs, updateFaq } from "./actions";
import type { Faq } from "./page";
import Link from "next/link";

export default function FaqsClient({ faqs: initial }: { faqs: Faq[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState(initial);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    await deleteFaq(id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
    setConfirmDeleteId(null);
    setLoadingId(null);
    router.refresh();
  }

  async function handleTogglePublished(faq: Faq) {
    setLoadingId(faq.id);
    const next = !faq.is_published;
    setFaqs((prev) =>
      prev.map((f) => (f.id === faq.id ? { ...f, is_published: next } : f))
    );
    await updateFaq(faq.id, { is_published: next });
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

    const from = faqs.findIndex((f) => f.id === draggingId);
    const to = faqs.findIndex((f) => f.id === targetId);
    const reordered = [...faqs];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    setFaqs(reordered);
    setDraggingId(null);
    setDragOverId(null);

    await reorderFaqs(reordered.map((f) => f.id));
    router.refresh();
  }

  if (faqs.length === 0) {
    return (
      <div className="text-center py-16 text-zinc-500">
        <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm mb-4">No FAQs yet.</p>
        <Link
          href="/admin/faqs/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          Add your first FAQ
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {faqs.map((faq) => {
        const isConfirming = confirmDeleteId === faq.id;
        const isLoading = loadingId === faq.id;
        const isDragOver = dragOverId === faq.id;
        const isDragging = draggingId === faq.id;

        return (
          <div
            key={faq.id}
            draggable
            onDragStart={() => handleDragStart(faq.id)}
            onDragOver={(e) => handleDragOver(e, faq.id)}
            onDrop={() => handleDrop(faq.id)}
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

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-medium truncate ${
                      faq.is_published ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    {faq.question}
                  </p>
                  {!faq.is_published && (
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                {isConfirming ? (
                  <>
                    <span className="text-xs text-zinc-400 mr-1 hidden sm:block">
                      Delete?
                    </span>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      disabled={isLoading}
                      className="text-xs text-white bg-destructive hover:bg-destructive/90 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Deleting…" : "Confirm"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleTogglePublished(faq)}
                      disabled={isLoading}
                      title={faq.is_published ? "Unpublish" : "Publish"}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40"
                    >
                      {faq.is_published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      href={`/admin/faqs/${faq.id}`}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setConfirmDeleteId(faq.id)}
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
