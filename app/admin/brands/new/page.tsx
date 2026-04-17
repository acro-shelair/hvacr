import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import BrandEditor from "../BrandEditor";

export const metadata = { title: "New Brand | HVACR Admin" };

export default function NewBrandPage() {
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
        <h1 className="text-2xl font-bold text-foreground">New Brand</h1>
      </div>
      <BrandEditor />
    </div>
  );
}
