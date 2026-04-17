import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import JobPostingEditor from "../JobPostingEditor";

export const metadata = { title: "New Job Posting | HVACR Admin" };

export default function NewJobPostingPage() {
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
        <h1 className="text-2xl font-bold text-foreground">New Job Posting</h1>
      </div>
      <JobPostingEditor />
    </div>
  );
}
