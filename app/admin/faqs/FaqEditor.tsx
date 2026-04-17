"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createFaq, updateFaq } from "./actions";
import type { Faq } from "./page";

type Props = {
  faq?: Faq;
};

export default function FaqEditor({ faq }: Props) {
  const router = useRouter();
  const isEdit = !!faq;

  const [question, setQuestion] = useState(faq?.question ?? "");
  const [answer, setAnswer] = useState(faq?.answer ?? "");
  const [isPublished, setIsPublished] = useState(faq?.is_published ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    setSaving(true);
    setError(null);

    if (isEdit) {
      const result = await updateFaq(faq.id, {
        question: question.trim(),
        answer: answer.trim(),
        is_published: isPublished,
      });
      if (result?.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    } else {
      const result = await createFaq(question.trim(), answer.trim());
      if (result?.error) {
        setError(result.error);
        setSaving(false);
        return;
      }
    }

    router.push("/admin/faqs");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Question
        </label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="e.g. What refrigerants do you supply?"
          required
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
          Answer
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Write the answer here…"
          required
          rows={6}
          className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-accent transition-colors resize-y"
        />
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
          disabled={saving || !question.trim() || !answer.trim()}
          className="px-5 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create FAQ"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/faqs")}
          className="px-5 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 text-sm font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
