"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Users, Pencil, Trash2, Plus, Shield, User } from "lucide-react";
import { deleteUser } from "./actions";
import type { AdminUser } from "./page";

export default function UsersClient({ users }: { users: AdminUser[] }) {
  const router = useRouter();
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleDelete(user: AdminUser) {
    setLoadingId(user.id);
    await deleteUser(user.id, user.email);
    setConfirmDeleteId(null);
    setLoadingId(null);
    router.refresh();
  }

  function fmt(iso: string | null) {
    if (!iso) return "Never";
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "numeric", month: "short", year: "numeric",
    });
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/users/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Invite User
        </Link>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No users yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((user) => {
            const isConfirming = confirmDeleteId === user.id;
            const isLoading = loadingId === user.id;

            return (
              <div
                key={user.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3.5 flex items-center gap-4"
              >
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center flex-shrink-0">
                  {user.role === "admin" ? (
                    <Shield className="w-4 h-4 text-accent" />
                  ) : (
                    <User className="w-4 h-4 text-zinc-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white truncate">{user.email}</p>
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        user.role === "admin"
                          ? "bg-accent/20 text-accent"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {user.role === "admin" ? "Administrator" : "Employee"}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Last sign in: {fmt(user.last_sign_in_at)}
                    {user.role === "employee" && user.permissions.length > 0 && (
                      <span className="ml-2">
                        · {user.permissions.length} permission{user.permissions.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </p>
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {isConfirming ? (
                    <>
                      <span className="text-xs text-zinc-400 mr-1 hidden sm:block">Remove user?</span>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={isLoading}
                        className="text-xs text-white bg-destructive hover:bg-destructive/90 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isLoading ? "Removing…" : "Confirm"}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setConfirmDeleteId(user.id)}
                        className="p-1.5 rounded-lg text-zinc-500 hover:text-destructive hover:bg-zinc-800 transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
