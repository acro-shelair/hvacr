import Link from "next/link";
import { Plus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import IndustriesClient from "./IndustriesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Industries | HVACR Admin" };

export interface Industry {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default async function IndustriesPage() {
  const db = createAdminClient();
  const { data } = await db
    .from("industries")
    .select("*")
    .order("display_order", { ascending: true });

  const industries = (data ?? []) as Industry[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Industries</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {industries.length} industr{industries.length !== 1 ? "ies" : "y"} ·
            drag to reorder
          </p>
        </div>
        <Link
          href="/admin/industries/new"
          className="inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors bg-accent text-accent-foreground hover:bg-accent/90 px-2.5 py-1.5 text-xs"
        >
          <Plus className="w-4 h-4" /> New Industry
        </Link>
      </div>
      <IndustriesClient initialIndustries={industries} />
    </div>
  );
}
