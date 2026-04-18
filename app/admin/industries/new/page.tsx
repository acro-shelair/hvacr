import { createAdminClient } from "@/lib/supabase/admin";
import IndustryEditor from "../IndustryEditor";

export const metadata = { title: "New Industry | HVACR Admin" };

export default async function NewIndustryPage() {
  const db = createAdminClient();
  const { count } = await db
    .from("industries")
    .select("*", { count: "exact", head: true });
  return <IndustryEditor nextPosition={count ?? 0} />;
}
