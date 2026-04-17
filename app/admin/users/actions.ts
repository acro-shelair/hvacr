"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { logActivity } from "@/lib/supabase/logging";
import type { Role, PermissionKey } from "@/lib/rbac";

export async function updateUser(
  userId: string,
  fields: { role: Role; permissions: PermissionKey[] }
) {
  const db = createAdminClient();
  const { error } = await db
    .from("user_profiles")
    .update({ role: fields.role, permissions: fields.permissions })
    .eq("user_id", userId);

  if (error) return { error: error.message };

  await logActivity("update", "user_profiles", `Updated user ${userId}`, userId);
  revalidatePath("/admin/users");
  return {};
}

export async function inviteUser(fields: {
  email: string;
  role: Role;
  permissions: PermissionKey[];
}) {
  const db = createAdminClient();

  const { data, error } = await db.auth.admin.inviteUserByEmail(fields.email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/admin/login`,
  });

  if (error) return { error: error.message };

  const userId = data.user.id;

  const { error: profileError } = await db.from("user_profiles").insert({
    user_id: userId,
    role: fields.role,
    permissions: fields.permissions,
  });

  if (profileError) return { error: profileError.message };

  await logActivity("create", "user_profiles", `Invited user: ${fields.email}`, userId);
  revalidatePath("/admin/users");
  return {};
}

export async function deleteUser(userId: string, email: string) {
  const db = createAdminClient();
  const { error } = await db.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };

  await logActivity("delete", "user_profiles", `Deleted user: ${email}`, userId);
  revalidatePath("/admin/users");
  return {};
}
