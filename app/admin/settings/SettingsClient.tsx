"use client";

import { useState } from "react";
import { saveSettings } from "./actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

type Field = { key: string; label: string; placeholder?: string; group: string };

export default function SettingsClient({
  fields,
  values: initial,
}: {
  fields: Field[];
  values: Record<string, string>;
}) {
  const [values, setValues] = useState<Record<string, string>>(initial);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const result = await saveSettings(values);

    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  const groups = Array.from(new Set(fields.map((f) => f.group)));

  return (
    <form onSubmit={handleSubmit} className="space-y-10 max-w-2xl pb-16">
      {groups.map((group) => (
        <section key={group} className="space-y-5">
          <h2 className="text-base font-semibold border-b border-border pb-2">{group}</h2>
          <div className="space-y-4">
            {fields
              .filter((f) => f.group === group)
              .map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <Label>{field.label}</Label>
                  <Input
                    type="text"
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                  />
                </div>
              ))}
          </div>
        </section>
      ))}

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Save Settings"}
        </Button>
        {saved && (
          <span className="text-sm text-emerald-500">Saved successfully.</span>
        )}
      </div>
    </form>
  );
}
