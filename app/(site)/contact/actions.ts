"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactFormState = {
  success?: boolean;
  error?: string;
};

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() || null;
  const enquiry_type =
    (formData.get("enquiry_type") as string | null)?.trim() ?? "General Enquiry";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!name || !email || !message) {
    return { error: "Please fill in all required fields." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("messages")
    .insert({ name, email, phone, enquiry_type, message });

  if (error) {
    return { error: "Failed to send your message. Please try again." };
  }

  return { success: true };
}
