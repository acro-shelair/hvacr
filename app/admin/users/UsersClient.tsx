"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { User } from "@supabase/supabase-js";
import {
  inviteUser,
  createUser,
  deleteUser,
  sendPasswordReset,
  updateUserEmail,
  updateUserPassword,
  setBanStatus,
  confirmUserEmail,
  upsertUserProfile,
  bulkSendPasswordReset,
} from "./actions";
import {
  PERMISSION_KEYS,
  PERMISSION_LABELS,
  PERMISSION_PRESETS,
  type PermissionKey,
  type Role,
  type UserProfile,
} from "@/lib/rbac";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  UserPlus,
  Trash2,
  Mail,
  ShieldCheck,
  MoreHorizontal,
  KeyRound,
  Ban,
  CheckCircle,
  RefreshCw,
  Pencil,
  Shield,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const formatDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

// ─── Role & permissions dialog ────────────────────────────────────────────────

function RoleDialog({
  user,
  profile,
  open,
  onClose,
  onSuccess,
}: {
  user: User;
  profile: UserProfile | null;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<Role>(profile?.role ?? "employee");
  const [permissions, setPermissions] = useState<PermissionKey[]>(
    (profile?.permissions ?? []) as PermissionKey[]
  );
  const [preset, setPreset] = useState("custom");

  const applyPreset = (key: string) => {
    setPreset(key);
    if (key !== "custom") {
      setPermissions(PERMISSION_PRESETS[key].permissions as PermissionKey[]);
    }
  };

  const togglePermission = (key: PermissionKey) => {
    setPreset("custom");
    setPermissions((prev) =>
      prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]
    );
  };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await upsertUserProfile(
        user.id,
        role,
        role === "admin" ? [] : permissions
      );
      onClose();
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Role & Permissions</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-1 truncate">
          {user.email}
        </p>

        <div className="space-y-2">
          <Label>Role</Label>
          <div className="flex gap-3">
            {(["admin", "employee"] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-colors ${
                  role === r
                    ? "bg-primary text-white border-primary"
                    : "border-border text-muted-foreground hover:border-foreground"
                }`}
              >
                {r === "admin" ? "Administrator" : "Employee"}
              </button>
            ))}
          </div>
          {role === "admin" && (
            <p className="text-xs text-muted-foreground bg-secondary px-3 py-2 rounded-lg">
              Administrators have full access to everything — no permission
              restrictions.
            </p>
          )}
        </div>

        {role === "employee" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Permissions</Label>
              <Select value={preset} onValueChange={applyPreset}>
                <SelectTrigger className="w-44 h-8 text-xs">
                  <SelectValue placeholder="Apply preset…" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PERMISSION_PRESETS).map(
                    ([key, { label }]) => (
                      <SelectItem key={key} value={key}>
                        {label}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {PERMISSION_KEYS.map((key) => (
                <label
                  key={key}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-border cursor-pointer hover:bg-secondary transition-colors"
                >
                  <Checkbox
                    checked={permissions.includes(key)}
                    onCheckedChange={() => togglePermission(key)}
                  />
                  <span className="text-sm">{PERMISSION_LABELS[key]}</span>
                </label>
              ))}
            </div>
            {permissions.length === 0 && (
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg">
                No permissions selected — this employee can only access their
                profile.
              </p>
            )}
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Invite dialog ────────────────────────────────────────────────────────────

const inviteSchema = z.object({ email: z.string().email() });
type InviteData = z.infer<typeof inviteSchema>;

function InviteDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<InviteData>({ resolver: zodResolver(inviteSchema) });
  const onSubmit = async (data: InviteData) => {
    setError(null);
    try {
      await inviteUser(data.email);
      reset();
      setOpen(false);
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Mail className="w-4 h-4 mr-1.5" /> Send Invite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Invite User</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          Sends an email with a link to set their password.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="user@example.com"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : "Send Invite"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Bulk reset dialog ────────────────────────────────────────────────────────

function BulkResetDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number } | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const handleSend = async () => {
    setSending(true);
    setError(null);
    setResult(null);
    try {
      const res = await bulkSendPasswordReset();
      setResult(res);
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed.");
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) {
          setResult(null);
          setError(null);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <KeyRound className="w-4 h-4 mr-1.5" /> Bulk Reset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Bulk Password Reset</DialogTitle>
        </DialogHeader>
        {!result ? (
          <>
            <p className="text-sm text-muted-foreground -mt-2">
              This will send a password reset email to{" "}
              <strong>every user</strong>. Useful for migrated accounts that
              need to set a new password.
            </p>
            {error && (
              <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}
            <div className="flex gap-2 justify-end mt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={sending}>
                {sending ? "Sending…" : "Send to All Users"}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground -mt-2">
              Sent <strong>{result.sent}</strong> reset email
              {result.sent !== 1 ? "s" : ""} successfully.
              {result.failed > 0 && (
                <>
                  {" "}
                  <span className="text-destructive">
                    {result.failed} failed.
                  </span>
                </>
              )}
            </p>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Done
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Create dialog ────────────────────────────────────────────────────────────

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Min. 6 characters"),
});
type CreateData = z.infer<typeof createSchema>;

function CreateDialog({ onSuccess }: { onSuccess: () => void }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateData>({ resolver: zodResolver(createSchema) });
  const onSubmit = async (data: CreateData) => {
    setError(null);
    try {
      await createUser(data.email, data.password);
      reset();
      setOpen(false);
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed.");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="w-4 h-4 mr-1.5" /> New User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground -mt-2">
          Creates account immediately, no email confirmation needed.
        </p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input
              type="email"
              {...register("email")}
              placeholder="user@example.com"
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Min. 6 characters"
            />
            {errors.password && (
              <p className="text-xs text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Edit email dialog ────────────────────────────────────────────────────────

const emailSchema = z.object({ email: z.string().email() });
const passwordSchema = z.object({ password: z.string().min(6) });
type EmailData = z.infer<typeof emailSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

function EditEmailDialog({
  user,
  open,
  onClose,
  onSuccess,
}: {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<EmailData>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: user.email ?? "" },
  });
  const onSubmit = async (data: EmailData) => {
    setError(null);
    try {
      await updateUserEmail(user.id, data.email);
      onClose();
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed.");
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Email</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>New Email</Label>
            <Input type="email" {...register("email")} />
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ChangePasswordDialog({
  user,
  open,
  onClose,
  onSuccess,
}: {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PasswordData>({ resolver: zodResolver(passwordSchema) });
  const onSubmit = async (data: PasswordData) => {
    setError(null);
    try {
      await updateUserPassword(user.id, data.password);
      reset();
      onClose();
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed.");
    }
  };
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1.5">
            <Label>New Password</Label>
            <Input
              type="password"
              {...register("password")}
              placeholder="Min. 6 characters"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── User actions dropdown ────────────────────────────────────────────────────

type DialogType = "role" | "email" | "password" | null;

function UserActions({
  user,
  profile,
  onRefresh,
}: {
  user: User;
  profile: UserProfile | null;
  onRefresh: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [activeDialog, setActiveDialog] = useState<DialogType>(null);
  const isBanned = !!(user as { banned_until?: string }).banned_until;

  const run = async (fn: () => Promise<void>) => {
    setLoading(true);
    try {
      await fn();
      onRefresh();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Action failed.");
    } finally {
      setLoading(false);
    }
  };

  const closeDialog = () => setActiveDialog(null);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost" disabled={loading}>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-52">
          <DropdownMenuItem onClick={() => setActiveDialog("role")}>
            <Shield className="w-3.5 h-3.5 mr-2" /> Role & Permissions
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setActiveDialog("email")}>
            <Pencil className="w-3.5 h-3.5 mr-2" /> Update Email
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveDialog("password")}>
            <KeyRound className="w-3.5 h-3.5 mr-2" /> Change Password
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => run(() => sendPasswordReset(user.email!))}
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2" /> Send Password Reset
          </DropdownMenuItem>
          {!user.email_confirmed_at && (
            <DropdownMenuItem
              onClick={() => run(() => confirmUserEmail(user.id))}
            >
              <CheckCircle className="w-3.5 h-3.5 mr-2" /> Confirm Email
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => run(() => setBanStatus(user.id, !isBanned))}
            className={isBanned ? "text-green-600" : "text-amber-600"}
          >
            <Ban className="w-3.5 h-3.5 mr-2" />
            {isBanned ? "Unban User" : "Ban User"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => {
              if (confirm(`Delete ${user.email}? This cannot be undone.`))
                run(() => deleteUser(user.id));
            }}
          >
            <Trash2 className="w-3.5 h-3.5 mr-2" /> Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RoleDialog
        user={user}
        profile={profile}
        open={activeDialog === "role"}
        onClose={closeDialog}
        onSuccess={onRefresh}
      />
      <EditEmailDialog
        user={user}
        open={activeDialog === "email"}
        onClose={closeDialog}
        onSuccess={onRefresh}
      />
      <ChangePasswordDialog
        user={user}
        open={activeDialog === "password"}
        onClose={closeDialog}
        onSuccess={onRefresh}
      />
    </>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20;

type ProfileMap = Record<
  string,
  { user_id: string; role: string; permissions: string[] }
>;

export default function UsersClient({
  initialUsers,
  profileMap,
}: {
  initialUsers: User[];
  profileMap: ProfileMap;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();
  const refresh = () => startTransition(() => router.refresh());
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(initialUsers.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const paginated = initialUsers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage accounts and access permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <BulkResetDialog onSuccess={refresh} />
          <InviteDialog onSuccess={refresh} />
          <CreateDialog onSuccess={refresh} />
        </div>
      </div>

      <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 mb-6">
        <ShieldCheck className="w-4 h-4 text-primary mt-0.5 shrink-0" />
        <p className="text-sm text-muted-foreground">
          Use <strong>Role & Permissions</strong> from the actions menu to
          assign roles. Employees only see the sections you grant them access
          to.
        </p>
      </div>

      {initialUsers.length === 0 ? (
        <p className="text-muted-foreground text-sm py-12 text-center">
          No users found.
        </p>
      ) : (
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-secondary border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-medium">User</th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  Role
                </th>
                <th className="text-left px-4 py-3 font-medium hidden md:table-cell">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell">
                  Last Sign In
                </th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((user, i) => {
                const profile = profileMap[user.id] as UserProfile | undefined;
                const confirmed = !!user.email_confirmed_at;
                const isBanned = !!(user as { banned_until?: string })
                  .banned_until;
                const role = profile?.role ?? null;
                return (
                  <tr
                    key={user.id}
                    className={
                      i < paginated.length - 1 ? "border-b border-border" : ""
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-bold text-primary">
                            {user.email?.[0]?.toUpperCase() ?? "?"}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate max-w-45">
                            {user.email}
                          </p>
                          <p className="text-xs text-muted-foreground font-mono">
                            {user.id.slice(0, 8)}…
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {role ? (
                        <Badge
                          variant={role === "admin" ? "default" : "secondary"}
                        >
                          {role === "admin" ? "Administrator" : "Employee"}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          No role
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {isBanned ? (
                        <Badge variant="destructive">Banned</Badge>
                      ) : confirmed ? (
                        <Badge variant="outline">Active</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                      {formatDate(user.last_sign_in_at)}
                    </td>
                    <td className="px-4 py-3">
                      <UserActions
                        user={user}
                        profile={profile ?? null}
                        onRefresh={refresh}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="flex items-center justify-between px-4 py-2 bg-secondary border-t border-border">
            <p className="text-xs text-muted-foreground">
              Showing {(safePage - 1) * PAGE_SIZE + 1}–
              {Math.min(safePage * PAGE_SIZE, initialUsers.length)} of{" "}
              {initialUsers.length} users
            </p>
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={safePage <= 1}
                  onClick={() => setPage(safePage - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(
                    (p) =>
                      p === 1 || p === totalPages || Math.abs(p - safePage) <= 1
                  )
                  .reduce<(number | "ellipsis")[]>((acc, p, idx, arr) => {
                    if (idx > 0 && p - (arr[idx - 1] as number) > 1)
                      acc.push("ellipsis");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, idx) =>
                    item === "ellipsis" ? (
                      <span
                        key={`e-${idx}`}
                        className="px-1 text-xs text-muted-foreground"
                      >
                        …
                      </span>
                    ) : (
                      <Button
                        key={item}
                        size="sm"
                        variant={item === safePage ? "default" : "ghost"}
                        className="w-8 h-8 p-0 text-xs"
                        onClick={() => setPage(item as number)}
                      >
                        {item}
                      </Button>
                    )
                  )}
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={safePage >= totalPages}
                  onClick={() => setPage(safePage + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
