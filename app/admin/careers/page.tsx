import { createClient } from "@/lib/supabase/server";
import CareersClient from "./CareersClient";

export const metadata = { title: "Careers | HVACR Admin" };

export type JobPosting = {
  id: string;
  title: string;
  location: string;
  employment_type: string;
  description: string;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

export type JobApplication = {
  id: string;
  job_posting_id: string | null;
  name: string;
  email: string;
  phone: string | null;
  position: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default async function CareersPage() {
  const supabase = await createClient();

  const [{ data: postings }, { data: applications }] = await Promise.all([
    supabase
      .from("job_postings")
      .select("id, title, location, employment_type, description, display_order, is_published, created_at")
      .order("display_order", { ascending: true }),
    supabase
      .from("job_applications")
      .select("id, job_posting_id, name, email, phone, position, message, is_read, created_at")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Careers</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Job postings and applicant inbox
        </p>
      </div>
      <CareersClient
        postings={(postings ?? []) as JobPosting[]}
        applications={(applications ?? []) as JobApplication[]}
      />
    </div>
  );
}
