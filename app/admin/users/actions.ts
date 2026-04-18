"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import type { Role, PermissionKey } from "@/lib/rbac";
import { logActivity } from "@/lib/supabase/logging";

export async function inviteUser(email: string) {
  const supabase = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/admin/set-password`,
  });
  if (error) throw new Error(error.message);
  await logActivity("create", "users", `Invited user: ${email}`);
}

export async function createUser(email: string, password: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) throw new Error(error.message);
  await logActivity("create", "users", `Created user: ${email}`);
}

export async function deleteUser(userId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) throw new Error(error.message);
  await logActivity("delete", "users", `Deleted user: ${userId}`);
}

export async function sendPasswordReset(email: string) {
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/auth/callback?next=/admin/set-password`,
  });
  if (error) throw new Error(error.message);
}

export async function updateUserEmail(userId: string, email: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, { email });
  if (error) throw new Error(error.message);
}

export async function updateUserPassword(userId: string, password: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, { password });
  if (error) throw new Error(error.message);
}

export async function setBanStatus(userId: string, banned: boolean) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    ban_duration: banned ? "87600h" : "none",
  });
  if (error) throw new Error(error.message);
  await logActivity("update", "users", `${banned ? "Banned" : "Unbanned"} user: ${userId}`);
}

export async function confirmUserEmail(userId: string) {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });
  if (error) throw new Error(error.message);
}

export async function upsertUserProfile(
  userId: string,
  role: Role,
  permissions: PermissionKey[]
) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from("user_profiles")
    .upsert(
      { user_id: userId, role, permissions, updated_at: new Date().toISOString() },
      { onConflict: "user_id" }
    );
  if (error) throw new Error(error.message);
  await logActivity("update", "users", `Updated role/permissions for: ${userId}`);
}

export async function bulkSendPasswordReset() {
  const supabase = createAdminClient();
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listError) throw new Error(listError.message);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { createClient } = await import("@supabase/supabase-js");
  const publicSupabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let sent = 0;
  let failed = 0;
  for (const user of users) {
    if (!user.email) continue;
    const { error } = await publicSupabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${siteUrl}/auth/callback?next=/admin/set-password`,
    });
    if (error) { failed++; } else { sent++; }
  }

  await logActivity("update", "users", `Bulk password reset sent to ${sent} users (${failed} failed)`);
  return { sent, failed, total: users.length };
}

export async function updateUser(
  userId: string,
  data: { role: Role; permissions: PermissionKey[] }
): Promise<{ error?: string }> {
  try {
    await upsertUserProfile(userId, data.role, data.permissions);
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update user." };
  }
}

export async function inviteUserWithProfile(data: {
  email: string;
  role: Role;
  permissions: PermissionKey[];
}): Promise<{ error?: string }> {
  try {
    const supabase = createAdminClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { data: invited, error } = await supabase.auth.admin.inviteUserByEmail(data.email, {
      redirectTo: `${siteUrl}/auth/callback?next=/admin/set-password`,
    });
    if (error) return { error: error.message };
    await logActivity("create", "users", `Invited user: ${data.email}`);
    if (invited?.user?.id) {
      await upsertUserProfile(invited.user.id, data.role, data.permissions);
    }
    return {};
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to invite user." };
  }
}

export async function getUserProfiles() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("user_profiles")
    .select("user_id, role, permissions");
  if (error) return [];
  return data;
}
