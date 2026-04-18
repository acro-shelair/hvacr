import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import IndustryEditor from "../../IndustryEditor";
import type { Industry } from "../../page";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit Industry | HVACR Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function EditIndustryPage({ params }: Props) {
  const { id } = await params;
  const db = createAdminClient();
  const { data } = await db
    .from("industries")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return <IndustryEditor industry={data as Industry} />;
}
