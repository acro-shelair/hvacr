"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

type BrandFields = {
  name?: string;
  slug?: string;
  specialty?: string;
  description?: string;
  logo_url?: string | null;
  website_url?: string | null;
  is_published?: boolean;
};

export async function createBrand(fields: BrandFields) {
  const supabase = await createClient();

  const { data: last } = await supabase
    .from("brands")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const display_order = last ? last.display_order + 1 : 0;

  const { data, error } = await supabase
    .from("brands")
    .insert({ ...fields, display_order })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logActivity("create", "brands", `Created brand: ${fields.name}`, data.id);
  revalidatePath("/admin/brands");
  return { id: data.id };
}

export async function updateBrand(id: string, fields: BrandFields) {
  const supabase = await createClient();
  const { error } = await supabase.from("brands").update(fields).eq("id", id);
  if (error) return { error: error.message };

  await logActivity("update", "brands", `Updated brand ${id}`, id);
  revalidatePath("/admin/brands");
  return {};
}

export async function deleteBrand(id: string) {
  const supabase = await createClient();
  await supabase.from("brands").delete().eq("id", id);
  await logActivity("delete", "brands", `Deleted brand ${id}`, id);
  revalidatePath("/admin/brands");
}

export async function reorderBrands(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("brands").update({ display_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin/brands");
}
