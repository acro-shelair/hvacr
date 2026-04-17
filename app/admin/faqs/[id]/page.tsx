import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import FaqEditor from "../FaqEditor";
import type { Faq } from "../page";

export const metadata = { title: "Edit FAQ | HVACR Admin" };

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("faqs")
    .select("id, question, answer, display_order, is_published, created_at")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/faqs"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to FAQs
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Edit FAQ</h1>
      </div>
      <FaqEditor faq={data as Faq} />
    </div>
  );
}
