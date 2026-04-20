"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export async function revalidatePages(paths: string[]) {
  for (const path of paths) {
    revalidatePath(path);
  }
  return { success: true, count: paths.length };
}

export async function getTableStats() {
  const supabase = createAdminClient();
  const tables = [
    "services", "industries", "brands", "faqs",
    "careers", "messages", "user_profiles", "activity_logs",
  ];

  const results = await Promise.all(
    tables.map(async (table) => {
      const { count } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      return { table, count: count ?? 0 };
    })
  );

  return results;
}

export async function clearOldLogs(daysOld: number) {
  const supabase = createAdminClient();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - daysOld);
  const { error, count } = await supabase
    .from("activity_logs")
    .delete({ count: "exact" })
    .lt("created_at", cutoff.toISOString());
  if (error) throw new Error(error.message);
  return { deleted: count ?? 0 };
}

export async function testDbConnection() {
  const supabase = createAdminClient();
  const start = Date.now();
  const { error } = await supabase.from("services").select("id").limit(1);
  const latency = Date.now() - start;
  return { ok: !error, latency, error: error?.message };
}
