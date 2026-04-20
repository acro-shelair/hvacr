import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import ServiceEditor from "../../ServiceEditor";
import type { Service } from "../../page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Service | HVACR Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function EditServicePage({ params }: Props) {
  const { id } = await params;
  const db = createAdminClient();

  const [{ data }, { data: slugsData }] = await Promise.all([
    db.from("services").select("*").eq("id", id).single(),
    db.from("services").select("slug, title").order("display_order"),
  ]);

  if (!data) notFound();

  const allServiceSlugs = (slugsData ?? []) as { slug: string; title: string }[];

  return <ServiceEditor service={data as Service} allServiceSlugs={allServiceSlugs} />;
}
