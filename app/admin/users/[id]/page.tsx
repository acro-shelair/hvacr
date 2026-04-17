import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import UserEditor from "../UserEditor";
import type { Role, PermissionKey } from "@/lib/rbac";

export const metadata = { title: "Edit User | HVACR Admin" };

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const db = createAdminClient();

  const [{ data: authUser }, { data: profile }] = await Promise.all([
    db.auth.admin.getUserById(id),
    db.from("user_profiles").select("role, permissions").eq("user_id", id).single(),
  ]);

  if (!authUser.user) notFound();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Edit User</h1>
        <p className="text-muted-foreground text-sm mt-1">Update role and permissions</p>
      </div>
      <UserEditor
        mode={{
          type: "edit",
          userId: id,
          email: authUser.user.email ?? "",
          role: (profile?.role as Role) ?? "employee",
          permissions: (profile?.permissions as PermissionKey[]) ?? [],
        }}
      />
    </div>
  );
}
