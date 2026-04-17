export type Role = "admin" | "employee";

export interface UserProfile {
  user_id: string;
  role: Role;
  permissions: PermissionKey[];
}

export const PERMISSION_KEYS = [
  "home",
  "brands",
  "industries",
  "messages",
  "faqs",
  "careers",
  "settings",
  "logs",
] as const;

export type PermissionKey = (typeof PERMISSION_KEYS)[number];

export const PERMISSION_LABELS: Record<PermissionKey, string> = {
  home: "Home Page",
  brands: "Brands",
  industries: "Industries",
  messages: "Messages",
  faqs: "FAQs",
  careers: "Careers",
  settings: "Settings",
  logs: "Activity Logs",
};

export const PERMISSION_PRESETS: Record<
  string,
  { label: string; permissions: PermissionKey[] }
> = {
  content_editor: {
    label: "Content Editor",
    permissions: ["home", "brands", "industries", "faqs"],
  },
  inbox_only: {
    label: "Inbox Only",
    permissions: ["messages"],
  },
  careers_manager: {
    label: "Careers Manager",
    permissions: ["careers"],
  },
  custom: {
    label: "Custom",
    permissions: [],
  },
};

export const PATH_PERMISSION_MAP: Record<string, PermissionKey | "admin_only"> = {
  "/admin/home": "home",
  "/admin/brands": "brands",
  "/admin/industries": "industries",
  "/admin/messages": "messages",
  "/admin/faqs": "faqs",
  "/admin/careers": "careers",
  "/admin/users": "admin_only",
  "/admin/settings": "settings",
  "/admin/logs": "logs",
};

/** Return the first admin path an employee is allowed to visit. */
export function getDefaultPage(profile: UserProfile): string {
  if (profile.role === "admin") return "/admin/home";

  const permissionToPath: [PermissionKey, string][] = [
    ["home", "/admin/home"],
    ["brands", "/admin/brands"],
    ["industries", "/admin/industries"],
    ["messages", "/admin/messages"],
    ["faqs", "/admin/faqs"],
    ["careers", "/admin/careers"],
    ["settings", "/admin/settings"],
    ["logs", "/admin/logs"],
  ];

  for (const [perm, path] of permissionToPath) {
    if (profile.permissions.includes(perm)) return path;
  }

  return "/admin/home";
}

export function canAccess(
  profile: UserProfile | null,
  pathname: string
): boolean {
  if (!profile) return false;
  if (profile.role === "admin") return true;

  if (pathname.startsWith("/admin/profile")) return true;

  const matchedKey = Object.entries(PATH_PERMISSION_MAP).find(([path]) =>
    pathname.startsWith(path)
  );

  if (!matchedKey) return true;
  const [, required] = matchedKey;

  if (required === "admin_only") return false;
  return profile.permissions.includes(required);
}
