"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/supabase/logging";

export async function markMessageRead(id: string) {
  const supabase = await createClient();
  await supabase.from("messages").update({ is_read: true }).eq("id", id);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(id: string) {
  const supabase = await createClient();
  await supabase.from("messages").delete().eq("id", id);
  await logActivity("delete", "messages", `Deleted message ${id}`, id);
  revalidatePath("/admin/messages");
}
