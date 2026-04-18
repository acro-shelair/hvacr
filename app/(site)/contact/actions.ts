"use server";

import { createClient } from "@/lib/supabase/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL!.trim(),
    to: process.env.CONTACT_NOTIFY_EMAIL!.trim(),
    subject: `New Enquiry: ${enquiry_type} from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone ?? "—"}\nType: ${enquiry_type}\n\n${message}`,
  });

  if (emailError) {
    console.error("[Resend] Failed to send email:", emailError);
  }

  return { success: true };
}
