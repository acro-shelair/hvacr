"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

// ── Job Postings ──────────────────────────────────────────────

export async function createJobPosting(fields: {
  title: string;
  location: string;
  employment_type: string;
  description: string;
}) {
  const supabase = await createClient();

  const { data: last } = await supabase
    .from("job_postings")
    .select("display_order")
    .order("display_order", { ascending: false })
    .limit(1)
    .single();

  const display_order = last ? last.display_order + 1 : 0;

  const { data, error } = await supabase
    .from("job_postings")
    .insert({ ...fields, display_order })
    .select("id")
    .single();

  if (error) return { error: error.message };

  await logActivity("create", "job_postings", `Created job posting: ${fields.title}`, data.id);
  revalidatePath("/admin/careers");
  return { id: data.id };
}

export async function updateJobPosting(
  id: string,
  fields: {
    title?: string;
    location?: string;
    employment_type?: string;
    description?: string;
    is_published?: boolean;
  }
) {
  const supabase = await createClient();
  const { error } = await supabase.from("job_postings").update(fields).eq("id", id);
  if (error) return { error: error.message };

  await logActivity("update", "job_postings", `Updated job posting ${id}`, id);
  revalidatePath("/admin/careers");
  return {};
}

export async function deleteJobPosting(id: string) {
  const supabase = await createClient();
  await supabase.from("job_postings").delete().eq("id", id);
  await logActivity("delete", "job_postings", `Deleted job posting ${id}`, id);
  revalidatePath("/admin/careers");
}

export async function reorderJobPostings(orderedIds: string[]) {
  const supabase = await createClient();
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("job_postings").update({ display_order: index }).eq("id", id)
    )
  );
  revalidatePath("/admin/careers");
}

// ── Applications ──────────────────────────────────────────────

export async function markApplicationRead(id: string) {
  const supabase = await createClient();
  await supabase.from("job_applications").update({ is_read: true }).eq("id", id);
  revalidatePath("/admin/careers");
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();
  await supabase.from("job_applications").delete().eq("id", id);
  await logActivity("delete", "job_applications", `Deleted application ${id}`, id);
  revalidatePath("/admin/careers");
}
