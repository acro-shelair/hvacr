"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_FILES = 3;
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_EXT = ["pdf", "doc", "docx"];

export type ApplyFormState = {
  success?: boolean;
  error?: string;
};

export async function submitJobApplication(
  _prev: ApplyFormState,
  formData: FormData
): Promise<ApplyFormState> {
  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const phone = (formData.get("phone") as string | null)?.trim() || null;
  const position = (formData.get("position") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";
  const job_posting_id =
    (formData.get("job_posting_id") as string | null)?.trim() || null;
  const files = formData.getAll("documents").filter((v): v is File => v instanceof File);

  if (!name || !email || !position || !message) {
    return { error: "Please fill in all required fields." };
  }

  const validFiles = files.filter((f) => f.size > 0);
  if (validFiles.length > MAX_FILES) {
    return { error: `Please attach no more than ${MAX_FILES} files.` };
  }
  for (const file of validFiles) {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!ALLOWED_EXT.includes(ext)) {
      return { error: `"${file.name}" is not a supported format (PDF, DOC, DOCX).` };
    }
    if (file.size > MAX_FILE_BYTES) {
      return { error: `"${file.name}" exceeds the 5MB limit.` };
    }
  }

  const admin = createAdminClient();
  const document_urls: string[] = [];
  const folder = job_posting_id ?? "general";

  for (const file of validFiles) {
    const safe = file.name.replace(/[^\w.-]+/g, "_");
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
    const { error: upErr } = await admin.storage
      .from("job-applications")
      .upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });
    if (upErr) {
      return { error: "Failed to upload documents. Please try again." };
    }
    document_urls.push(path);
  }

  const supabase = await createClient();
  const { error } = await supabase.from("job_applications").insert({
    job_posting_id,
    name,
    email,
    phone,
    position,
    message,
    document_urls,
  });

  if (error) {
    if (document_urls.length) {
      await admin.storage.from("job-applications").remove(document_urls);
    }
    return { error: "Failed to submit your application. Please try again." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const notifyTo = process.env.CONTACT_NOTIFY_EMAIL?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();

  if (notifyTo && from) {
    const { error: emailErr } = await resend.emails.send({
      from,
      to: notifyTo,
      subject: `New application: ${position} from ${name}`,
      text:
        `${name} has applied for ${position}.\n\n` +
        `Email: ${email}\n` +
        `Phone: ${phone ?? "—"}\n` +
        `Attachments: ${document_urls.length}\n\n` +
        `View in admin: ${siteUrl}/admin/careers`,
    });
    if (emailErr) {
      console.error("[Resend] Failed to send careers notification:", emailErr);
    }
  }

  return { success: true };
}
