"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PERMISSION_KEYS, PERMISSION_LABELS, PERMISSION_PRESETS } from "@/lib/rbac";
import type { Role, PermissionKey } from "@/lib/rbac";
import { updateUser, inviteUser } from "./actions";

type Mode =
  | { type: "edit"; userId: string; email: string; role: Role; permissions: PermissionKey[] }
  | { type: "new" };

export default function UserEditor({ mode }: { mode: Mode }) {
  const router = useRouter();

  const [email, setEmail] = useState(mode.type === "new" ? "" : mode.email);
  const [role, setRole] = useState<Role>(mode.type === "edit" ? mode.role : "employee");
  const [permissions, setPermissions] = useState<PermissionKey[]>(
    mode.type === "edit" ? mode.permissions : []
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function togglePermission(key: PermissionKey) {
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  }

  function applyPreset(presetKey: string) {
    const preset = PERMISSION_PRESETS[presetKey];
    if (preset) setPermissions([...preset.permissions]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    let result: { error?: string };

    if (mode.type === "edit") {
      result = await updateUser(mode.userId, {
        role,
        permissions: role === "admin" ? [] : permissions,
      });
    } else {
      result = await inviteUser({
        email,
        role,
        permissions: role === "admin" ? [] : permissions,
      });
    }

    setSaving(false);
    if (result.error) {
      setError(result.error);
    } else {
      router.push("/admin/users");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-lg">
      {mode.type === "new" && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">
            Email address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
          />
          <p className="text-xs text-zinc-500 mt-1.5">
            An invitation email will be sent to this address.
          </p>
        </div>
      )}

      {mode.type === "edit" && (
        <div>
          <p className="text-sm font-medium text-foreground mb-1">User</p>
          <p className="text-sm text-zinc-400">{mode.email}</p>
        </div>
      )}

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Role</label>
        <div className="flex gap-3">
          {(["admin", "employee"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                role === r
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-white"
              }`}
            >
              {r === "admin" ? "Administrator" : "Employee"}
            </button>
          ))}
        </div>
        {role === "admin" && (
          <p className="text-xs text-zinc-500 mt-2">
            Administrators have full access to all sections. No permission restrictions apply.
          </p>
        )}
      </div>

      {/* Permissions (employees only) */}
      {role === "employee" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-foreground">Permissions</label>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(PERMISSION_PRESETS)
              .filter(([k]) => k !== "custom")
              .map(([key, preset]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => applyPreset(key)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            <button
              type="button"
              onClick={() => setPermissions([])}
              className="text-xs px-3 py-1.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors"
            >
              Clear all
            </button>
          </div>

          <div className="space-y-2">
            {PERMISSION_KEYS.map((key) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={permissions.includes(key)}
                  onChange={() => togglePermission(key)}
                  className="w-4 h-4 rounded accent-accent"
                />
                <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">
                  {PERMISSION_LABELS[key]}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors disabled:opacity-50"
        >
          {saving
            ? mode.type === "new" ? "Sending invite…" : "Saving…"
            : mode.type === "new" ? "Send Invite" : "Save Changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2.5 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
