import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import IndustryEditor from "../IndustryEditor";

export const metadata = { title: "New Industry | HVACR Admin" };

export default function NewIndustryPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/industries"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Industries
        </Link>
        <h1 className="text-2xl font-bold text-foreground">New Industry</h1>
      </div>
      <IndustryEditor />
    </div>
  );
}
