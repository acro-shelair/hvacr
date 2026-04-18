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
  services: string[];
  logo_url: string | null;
  icon: string | null;
  website_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

export default async function BrandsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("brands")
    .select(
      "id, name, slug, specialty, description, services, logo_url, icon, website_url, display_order, is_published, created_at"
    )
    .order("display_order", { ascending: true });

  const brands = (data ?? []) as Brand[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Brands</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {brands.length} brand{brands.length !== 1 ? "s" : ""} · drag to
            reorder
          </p>
        </div>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors bg-accent text-accent-foreground hover:bg-accent/90 px-2.5 py-1.5 text-xs"
        >
          <Plus className="w-4 h-4" /> New Brand
        </Link>
      </div>
      <BrandsClient brands={brands} />
    </div>
  );
}
