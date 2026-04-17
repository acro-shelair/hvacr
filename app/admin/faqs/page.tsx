import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import FaqsClient from "./FaqsClient";

export const metadata = { title: "FAQs | HVACR Admin" };

export type Faq = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

export default async function FaqsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("id, question, answer, display_order, is_published, created_at")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">FAQs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {(data ?? []).length} question{(data ?? []).length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/faqs/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </Link>
      </div>
      <FaqsClient faqs={(data ?? []) as Faq[]} />
    </div>
  );
}
