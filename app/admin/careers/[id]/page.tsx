import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import JobPostingEditor from "../JobPostingEditor";
import type { JobPosting } from "../page";

export const metadata = { title: "Edit Job Posting | HVACR Admin" };

export default async function EditJobPostingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("job_postings")
    .select("id, title, location, employment_type, description, display_order, is_published, created_at")
    .eq("id", id)
    .single();

  if (!data) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/careers"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Careers
        </Link>
        <h1 className="text-2xl font-bold text-foreground">Edit Job Posting</h1>
      </div>
      <JobPostingEditor posting={data as JobPosting} />
    </div>
  );
}
