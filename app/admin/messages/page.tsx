import { createClient } from "@/lib/supabase/server";
import MessagesClient from "./MessagesClient";

export const metadata = { title: "Messages | HVACR Admin" };

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

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("id, name, email, phone, enquiry_type, message, is_read, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Messages</h1>
        <p className="text-muted-foreground text-sm mt-1">Contact form submissions</p>
      </div>
      <MessagesClient messages={(data ?? []) as Message[]} />
    </div>
  );
}
