import { createAdminClient } from "@/lib/supabase/admin";
import { getUserProfiles } from "./actions";
import UsersClient from "./UsersClient";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const supabase = createAdminClient();
  const [{ data, error }, profiles] = await Promise.all([
    supabase.auth.admin.listUsers(),
    getUserProfiles(),
  ]);

  const users = error ? [] : data.users;
  const profileMap = Object.fromEntries(profiles.map((p) => [p.user_id, p]));

  return <UsersClient initialUsers={users} profileMap={profileMap} />;
}
