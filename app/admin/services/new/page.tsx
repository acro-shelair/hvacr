import { createAdminClient } from "@/lib/supabase/admin";
import ServiceEditor from "../ServiceEditor";

export const metadata = { title: "New Service | HVACR Admin" };

export default async function NewServicePage() {
  const db = createAdminClient();
  const { data } = await db.from("services").select("slug, title").order("display_order");
  const allServiceSlugs = (data ?? []) as { slug: string; title: string }[];
  return <ServiceEditor allServiceSlugs={allServiceSlugs} />;
}
