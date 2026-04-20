"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

export type ProcessStep = { step: string; title: string; description: string };
export type Stat = { value: string; label: string };

export type ServiceFields = {
  slug?: string;
  eyebrow?: string;
  title?: string;
  hero_description?: string;
  icon_name?: string;
  overview?: string;
  features?: string[];
  process?: ProcessStep[];
  stats?: Stat[];
  related_services?: string[];
  meta_title?: string;
  meta_description?: string;
  schema_json?: Record<string, unknown> | null;
  cta_eyebrow?: string;
  cta_heading?: string;
  cta_body?: string;
  cta_btn1_label?: string;
  cta_btn1_href?: string;
  cta_btn2_label?: string;
  cta_btn2_href?: string;
  is_published?: boolean;
};

export async function createService(fields: ServiceFields) {
  const supabase = await createClient();

  const { data: last } = await supabase
    .from("services")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const display_order = last ? last.display_order + 1 : 0;

  const { data, error } = await supabase
    .from("services")
    .insert({ ...fields, display_order })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logActivity("create", "services", `Created service: ${fields.title}`, data.id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return { id: data.id };
}

export async function updateService(id: string, fields: ServiceFields) {
  const supabase = await createClient();
  const { error } = await supabase.from("services").update(fields).eq("id", id);
  if (error) return { error: error.message };

  await logActivity("update", "services", `Updated service ${id}`, id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
  return {};
}

export async function deleteService(id: string) {
  const supabase = await createClient();
  await supabase.from("services").delete().eq("id", id);
  await logActivity("delete", "services", `Deleted service ${id}`, id);
  revalidatePath("/admin/services");
  revalidatePath("/services");
}

export async function reorderServices(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("services").update({ display_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin/services");
  revalidatePath("/services");
}
