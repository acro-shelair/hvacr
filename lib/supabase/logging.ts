"use server";

import { createAdminClient } from "./admin";
import { createClient } from "./server";

export type LogAction = "create" | "update" | "delete" | "login" | "logout";

export async function logActivity(
  action: LogAction,
  tableName: string,
  details: string,
  recordId?: string,
  emailOverride?: string
) {
  try {
    let userEmail = emailOverride ?? "";
    let userId: string | null = null;

    if (!userEmail) {
      const serverClient = await createClient();
      const { data: { user } } = await serverClient.auth.getUser();
      userId = user?.id ?? null;
      userEmail = user?.email ?? "system";
    }

    const adminClient = createAdminClient();
    await adminClient.from("activity_logs").insert({
      user_id: userId,
      user_email: userEmail,
      action,
      table_name: tableName,
      record_id: recordId ?? null,
      details,
    });
  } catch {
    // Logging must never break the main action
  }
}
