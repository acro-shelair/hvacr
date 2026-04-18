"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/supabase/logging";

export async function markMessageRead(id: string) {
  const supabase = createAdminClient();
  await supabase.from("messages").update({ is_read: true }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const supabase = createAdminClient();
  await supabase.from("messages").delete().eq("id", id);
  await logActivity("delete", "messages", `Deleted message ${id}`, id);
  revalidatePath("/admin/messages");
}
