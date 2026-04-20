import Link from "next/link";
import { Plus } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import ServicesClient from "./ServicesClient";

export const dynamic = "force-dynamic";
export const metadata = { title: "Services | HVACR Admin" };

export interface Service {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  hero_description: string;
  icon_name: string;
  overview: string;
  features: string[];
  process: { step: string; title: string; description: string }[];
  stats: { value: string; label: string }[];
  related_services: string[];
  meta_title: string;
  meta_description: string;
  schema_json: Record<string, unknown> | null;
  cta_eyebrow: string;
  cta_heading: string;
  cta_body: string;
  cta_btn1_label: string;
  cta_btn1_href: string;
  cta_btn2_label: string;
  cta_btn2_href: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default async function ServicesAdminPage() {
  const db = createAdminClient();
  const { data } = await db
    .from("services")
    .select("*")
    .order("display_order", { ascending: true });

  const services = (data ?? []) as Service[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {services.length} service{services.length !== 1 ? "s" : ""} · drag to reorder
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-1.5 rounded-lg font-medium transition-colors bg-accent text-accent-foreground hover:bg-accent/90 px-2.5 py-1.5 text-xs"
        >
          <Plus className="w-4 h-4" /> New Service
        </Link>
      </div>
      <ServicesClient initialServices={services} />
    </div>
  );
}
