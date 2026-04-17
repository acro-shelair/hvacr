import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import BrandEditor from "../BrandEditor";
import type { Brand } from "../page";

export const metadata = { title: "Edit Brand | HVACR Admin" };

type Props = { params: Promise<{ id: string }> };

export default async function EditBrandPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("brands")
    .select("id, name, slug, specialty, description, logo_url, website_url, display_order, is_published, created_at")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/brands"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Brands
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Edit Brand</h1>
        <p className="text-muted-foreground text-sm mt-1">{data.name}</p>
      </div>
      <BrandEditor brand={data as Brand} />
    </div>
  );
}
