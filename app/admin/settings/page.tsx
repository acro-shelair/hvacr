import { createAdminClient } from "@/lib/supabase/admin";
import SettingsClient from "./SettingsClient";

export const metadata = { title: "Settings | HVACR Admin" };

const SETTING_FIELDS: { key: string; label: string; placeholder?: string; group: string }[] = [
  { key: "site_name",       label: "Site Name",     placeholder: "HVACR Group",                       group: "General" },
  { key: "site_tagline",    label: "Tagline",        placeholder: "Your trusted HVACR partner",        group: "General" },
  { key: "contact_email",   label: "Contact Email",  placeholder: "info@example.com.au",               group: "Contact" },
  { key: "contact_phone",   label: "Contact Phone",  placeholder: "+61 2 0000 0000",                   group: "Contact" },
  { key: "contact_address", label: "Address",        placeholder: "123 Example St, Sydney NSW 2000",   group: "Contact" },
  { key: "social_facebook",  label: "Facebook URL",  placeholder: "https://facebook.com/…",            group: "Social" },
  { key: "social_instagram", label: "Instagram URL", placeholder: "https://instagram.com/…",           group: "Social" },
  { key: "social_linkedin",  label: "LinkedIn URL",  placeholder: "https://linkedin.com/company/…",    group: "Social" },
];

export { SETTING_FIELDS };

export default async function SettingsPage() {
  const { data } = await createAdminClient()
    .from("site_settings")
    .select("key, value");

  const values: Record<string, string> = {};
  for (const row of data ?? []) values[row.key] = row.value;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Site-wide configuration</p>
      </div>
      <SettingsClient fields={SETTING_FIELDS} values={values} />
    </div>
  );
}
