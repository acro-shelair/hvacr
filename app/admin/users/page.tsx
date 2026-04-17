import { createAdminClient } from "@/lib/supabase/admin";
import UsersClient from "./UsersClient";
import type { Role, PermissionKey } from "@/lib/rbac";

export const metadata = { title: "Users | HVACR Admin" };

export type AdminUser = {
  id: string;
  email: string;
  role: Role;
  permissions: PermissionKey[];
  created_at: string;
  last_sign_in_at: string | null;
};

export default async function UsersPage() {
  const db = createAdminClient();

  const [{ data: authData }, { data: profiles }] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 200 }),
    db.from("user_profiles").select("user_id, role, permissions"),
  ]);

  const profileMap = new Map(
    (profiles ?? []).map((p) => [p.user_id, p])
  );

  const users: AdminUser[] = (authData?.users ?? []).map((u) => {
    const profile = profileMap.get(u.id);
    return {
      id: u.id,
      email: u.email ?? "",
      role: (profile?.role as Role) ?? "employee",
      permissions: (profile?.permissions as PermissionKey[]) ?? [],
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at ?? null,
    };
  });

  users.sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (b.role === "admin" && a.role !== "admin") return 1;
    return a.email.localeCompare(b.email);
  });

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm mt-1">Admin panel accounts</p>
        </div>
      </div>
      <UsersClient users={users} />
    </div>
  );
}
