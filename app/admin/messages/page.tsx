import { createAdminClient } from "@/lib/supabase/admin";
import MessagesClient from "./MessagesClient";

export const dynamic = "force-dynamic";

export type Message = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  enquiry_type: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

const PAGE_SIZE = 20;

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; enquiry_type?: string; q?: string }>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const enquiryType = params.enquiry_type ?? "all";
  const q = params.q ?? "";

  const supabase = createAdminClient();
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("messages")
    .select("id, name, email, phone, enquiry_type, message, is_read, created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false });

  if (enquiryType !== "all") query = query.eq("enquiry_type", enquiryType);
  if (q) {
    query = query.or(
      `name.ilike.%${q}%,email.ilike.%${q}%,message.ilike.%${q}%`
    );
  }
  query = query.range(from, to);

  const [{ data, count }, { data: typeRows }] = await Promise.all([
    query,
    supabase.from("messages").select("enquiry_type"),
  ]);

  const enquiryTypes = [
    ...new Set(
      (typeRows ?? []).map((r: { enquiry_type: string }) => r.enquiry_type)
    ),
  ].sort();

  return (
    <MessagesClient
      messages={(data ?? []) as Message[]}
      totalCount={count ?? 0}
      page={page}
      pageSize={PAGE_SIZE}
      enquiryTypes={enquiryTypes}
      filters={{ enquiryType, q }}
    />
  );
}
