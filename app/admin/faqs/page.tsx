import { createClient } from "@/lib/supabase/server";
import FaqsClient from "./FaqsClient";

export const dynamic = "force-dynamic";

export type Faq = {
  id: string;
  question: string;
  answer: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

export default async function FaqsAdminPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("faqs")
    .select("id, question, answer, display_order, is_published, created_at")
    .order("display_order", { ascending: true });
  return <FaqsClient initialFaqs={(data ?? []) as Faq[]} />;
}
