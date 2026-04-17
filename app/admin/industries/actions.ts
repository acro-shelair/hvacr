"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

type IndustryFields = {
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string | null;
  is_published?: boolean;
};

export async function createIndustry(fields: IndustryFields) {
  const supabase = await createClient();

  const { data: last } = await supabase
    .from("industries")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const display_order = last ? last.display_order + 1 : 0;

  const { data, error } = await supabase
    .from("industries")
    .insert({ ...fields, display_order })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logActivity("create", "industries", `Created industry: ${fields.name}`, data.id);
  revalidatePath("/admin/industries");
  return { id: data.id };
}

export async function updateIndustry(id: string, fields: IndustryFields) {
  const supabase = await createClient();
  const { error } = await supabase.from("industries").update(fields).eq("id", id);
  if (error) return { error: error.message };

  await logActivity("update", "industries", `Updated industry ${id}`, id);
  revalidatePath("/admin/industries");
  return {};
}

export async function deleteIndustry(id: string) {
  const supabase = await createClient();
  await supabase.from("industries").delete().eq("id", id);
  await logActivity("delete", "industries", `Deleted industry ${id}`, id);
  revalidatePath("/admin/industries");
}

export async function reorderIndustries(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("industries").update({ display_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin/industries");
}
