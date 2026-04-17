import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import BrandsClient from "./BrandsClient";

export const metadata = { title: "Brands | HVACR Admin" };

export type Brand = {
  id: string;
  name: string;
  slug: string;
  specialty: string;
  description: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

export default async function BrandsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select("id, name, slug, specialty, description, logo_url, website_url, display_order, is_published, created_at")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Brands</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {(data ?? []).length} brand{(data ?? []).length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Brand
        </Link>
      </div>
      <BrandsClient brands={(data ?? []) as Brand[]} />
    </div>
  );
}
