import { createAdminClient } from "@/lib/supabase/admin";
import LogsClient from "./LogsClient";

export const metadata = { title: "Activity Logs | HVACR Admin" };

export type ActivityLog = {
  id: string;
  user_email: string | null;
  action: string;
  table_name: string;
  record_id: string | null;
  details: string | null;
  created_at: string;
};

export default async function LogsPage() {
  const { data } = await createAdminClient()
    .from("activity_logs")
    .select("id, user_email, action, table_name, record_id, details, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Audit trail of admin actions (last 200)
        </p>
      </div>
      <LogsClient logs={(data ?? []) as ActivityLog[]} />
    </div>
  );
}
