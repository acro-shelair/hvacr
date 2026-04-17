import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import FaqEditor from "../FaqEditor";

export const metadata = { title: "New FAQ | HVACR Admin" };

export default function NewFaqPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/faqs"
          className="inline-flex items-center gap-1 text-sm text-zinc-400 hover:text-white transition-colors mb-3"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to FAQs
        </Link>
        <h1 className="text-2xl font-bold text-foreground">New FAQ</h1>
      </div>
      <FaqEditor />
    </div>
  );
}
