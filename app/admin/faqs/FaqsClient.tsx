"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createFaq, updateFaq, deleteFaq, reorderFaqs } from "./actions";
import type { Faq } from "./page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Pencil,
  Trash2,
  HelpCircle,
  X,
  GripVertical,
  Eye,
  EyeOff,
} from "lucide-react";

// ─── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  question: z.string().min(1, "Required"),
  answer: z.string().min(1, "Required"),
});
type FormData = z.infer<typeof schema>;

// ─── Simple modal ─────────────────────────────────────────────────────────────

function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80" onClick={onClose} />
      <div className="relative z-50 w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 transition-opacity"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
}

// ─── Add / Edit dialog ────────────────────────────────────────────────────────

function FaqDialog({ faq, onSuccess }: { faq?: Faq; onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPublished, setIsPublished] = useState(faq?.is_published ?? true);
  const isEdit = !!faq;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      question: faq?.question ?? "",
      answer: faq?.answer ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      if (isEdit) {
        const result = await updateFaq(faq.id, { ...data, is_published: isPublished });
        if (result?.error) throw new Error(result.error);
      } else {
        const result = await createFaq(data.question, data.answer);
        if (result?.error) throw new Error(result.error);
      }
      reset();
      setOpen(false);
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed.");
    }
  };

  return (
    <>
      {isEdit ? (
        <Button size="sm" variant="ghost" onClick={() => setOpen(true)} title="Edit">
          <Pencil className="w-3.5 h-3.5" />
        </Button>
      ) : (
        <Button size="sm" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4 mr-1" /> New FAQ
        </Button>
      )}
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="mb-4">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            {isEdit ? "Edit FAQ" : "New FAQ"}
          </h2>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Question</Label>
            <Input {...register("question")} placeholder="e.g. How quickly can you respond?" />
            {errors.question && (
              <p className="text-xs text-destructive">{errors.question.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Answer</Label>
            <Textarea
              {...register("answer")}
              rows={5}
              className="resize-none"
              placeholder="Provide a clear, helpful answer…"
            />
            {errors.answer && (
              <p className="text-xs text-destructive">{errors.answer.message}</p>
            )}
          </div>
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
            <span className="text-sm text-muted-foreground">
              {isPublished ? "Published" : "Draft (hidden from public site)"}
            </span>
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function FaqsClient({ initialFaqs }: { initialFaqs: Faq[] }) {
  const router = useRouter();
  const [faqs, setFaqs] = useState(initialFaqs);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const refresh = () => router.refresh();

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">FAQs</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            FAQ accordion shown on the home page.
          </p>
        </div>
        <FaqDialog onSuccess={refresh} />
      </div>

      {faqs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <HelpCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No FAQs yet. Add your first one.</p>
        </div>
      ) : (
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
              className={`flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4 transition-all ${
                isDragging ? "opacity-40" : "opacity-100"
              } ${isDragOver ? "border-primary" : ""}`}
            >
              <div className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
                <GripVertical className="w-4 h-4" />
              </div>

              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-sm font-semibold truncate ${faq.is_published ? "" : "text-muted-foreground"}`}>
                    {faq.question}
                  </p>
                  {!faq.is_published && (
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 truncate">{faq.answer}</p>
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
                      onClick={() => handleDelete(faq.id)}
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
                      onClick={() => handleTogglePublished(faq)}
                      disabled={isLoading}
                      title={faq.is_published ? "Unpublish" : "Publish"}
                    >
                      {faq.is_published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </Button>
                    <FaqDialog faq={faq} onSuccess={refresh} />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setConfirmDeleteId(faq.id)}
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
      )}
    </div>
  );
}
