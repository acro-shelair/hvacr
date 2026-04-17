"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

export async function createFaq(question: string, answer: string) {
  const supabase = await createClient();

  const { data: last } = await supabase
    .from("faqs")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const display_order = last ? last.display_order + 1 : 0;

  const { data, error } = await supabase
    .from("faqs")
    .insert({ question, answer, display_order })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logActivity("create", "faqs", `Created FAQ: ${question.slice(0, 60)}`, data.id);
  revalidatePath("/admin/faqs");
  return { id: data.id };
}

export async function updateFaq(
  id: string,
  fields: { question?: string; answer?: string; is_published?: boolean }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("faqs").update(fields).eq("id", id);
  if (error) return { error: error.message };

  await logActivity("update", "faqs", `Updated FAQ ${id}`, id);
  revalidatePath("/admin/faqs");
  return {};
}

export async function deleteFaq(id: string) {
  const supabase = await createClient();
  await supabase.from("faqs").delete().eq("id", id);
  await logActivity("delete", "faqs", `Deleted FAQ ${id}`, id);
  revalidatePath("/admin/faqs");
}

export async function reorderFaqs(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("faqs").update({ display_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin/faqs");
}
