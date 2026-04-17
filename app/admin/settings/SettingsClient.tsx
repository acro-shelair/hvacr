"use client";

import { useState } from "react";
import { saveSettings } from "./actions";

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
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {groups.map((group) => (
        <section key={group}>
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-4">
            {group}
          </h2>
          <div className="space-y-4">
            {fields
              .filter((f) => f.group === group)
              .map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={values[field.key] ?? ""}
                    onChange={(e) =>
                      setValues((prev) => ({ ...prev, [field.key]: e.target.value }))
                    }
                    placeholder={field.placeholder}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                  />
                </div>
              ))}
          </div>
        </section>
      ))}

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save Settings"}
        </button>
        {saved && (
          <span className="text-sm text-emerald-400">Saved successfully.</span>
        )}
      </div>
    </form>
  );
}
