import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import IndustriesClient from "./IndustriesClient";

export const metadata = { title: "Industries | HVACR Admin" };

export type Industry = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

export default async function IndustriesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("industries")
    .select("id, name, slug, description, image_url, display_order, is_published, created_at")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Industries</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {(data ?? []).length} industr{(data ?? []).length !== 1 ? "ies" : "y"}
          </p>
        </div>
        <Link
          href="/admin/industries/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Industry
        </Link>
      </div>
      <IndustriesClient industries={(data ?? []) as Industry[]} />
    </div>
  );
}
