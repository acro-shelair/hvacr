"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

export async function saveSettings(fields: Record<string, string>) {
  const supabase = await createClient();

  const rows = Object.entries(fields).map(([key, value]) => ({ key, value }));

  const { error } = await supabase
    .from("site_settings")
    .upsert(rows, { onConflict: "key" });

  if (error) return { error: error.message };

  await logActivity("update", "site_settings", "Updated site settings");
  revalidatePath("/admin/settings");
  return {};
}
