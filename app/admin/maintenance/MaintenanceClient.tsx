"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { revalidatePages, clearOldLogs } from "./actions";
import {
  RefreshCw, Database, Wifi, WifiOff, Trash2, CheckCircle,
} from "lucide-react";

interface TableStat { table: string; count: number }
interface DbStatus  { ok: boolean; latency: number; error?: string }

const TABLE_LABELS: Record<string, string> = {
  services: "Services", industries: "Industries", brands: "Brands",
  faqs: "FAQs", careers: "Careers", messages: "Messages",
  user_profiles: "User Profiles", activity_logs: "Activity Logs",
};

const REVALIDATE_GROUPS = [
  {
    label: "All Public Pages",
    description: "Revalidates the entire site cache",
    paths: ["/", "/services", "/industries", "/brands", "/contact"],
  },
  {
    label: "Services",
    description: "Clears cache for services pages",
    paths: ["/services"],
  },
  {
    label: "Industries",
    description: "Clears cache for industry pages",
    paths: ["/industries"],
  },
  {
    label: "Brands",
    description: "Clears cache for brand pages",
    paths: ["/brands"],
  },
  {
    label: "Home Page",
    description: "Clears cache for the home page only",
    paths: ["/"],
  },
];

export default function MaintenanceClient({
  stats,
  dbStatus,
}: {
  stats: TableStat[];
  dbStatus: DbStatus;
}) {
  const [revalidating, setRevalidating] = useState<string | null>(null);
  const [revalidated, setRevalidated]   = useState<string | null>(null);
  const [clearing, setClearing]         = useState(false);
  const [clearResult, setClearResult]   = useState<string | null>(null);

  const handleRevalidate = async (label: string, paths: string[]) => {
    setRevalidating(label);
    setRevalidated(null);
    await revalidatePages(paths);
    setRevalidating(null);
    setRevalidated(label);
    setTimeout(() => setRevalidated(null), 3000);
  };

  const handleClearLogs = async (days: number) => {
    if (!confirm(`Delete activity logs older than ${days} days?`)) return;
    setClearing(true);
    setClearResult(null);
    try {
      const { deleted } = await clearOldLogs(days);
      setClearResult(`Deleted ${deleted} log entries older than ${days} days.`);
    } catch (e: unknown) {
      setClearResult(e instanceof Error ? e.message : "Failed.");
    } finally {
      setClearing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Maintenance</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Cache management, database stats and system tools.
        </p>
      </div>

      {/* ── DB Status ──────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Database Status</h2>
        <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
          dbStatus.ok
            ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
            : "bg-destructive/5 border-destructive/20"
        }`}>
          {dbStatus.ok ? (
            <Wifi className="w-5 h-5 text-green-600 flex-shrink-0" />
          ) : (
            <WifiOff className="w-5 h-5 text-destructive flex-shrink-0" />
          )}
          <div>
            <p className={`text-sm font-semibold ${dbStatus.ok ? "text-green-700 dark:text-green-400" : "text-destructive"}`}>
              {dbStatus.ok ? "Connected" : "Connection failed"}
            </p>
            <p className="text-xs text-muted-foreground">
              {dbStatus.ok
                ? `Supabase responded in ${dbStatus.latency}ms`
                : dbStatus.error}
            </p>
          </div>
        </div>
      </section>

      {/* ── Table Stats ────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Database className="w-4 h-4" /> Database Records
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {stats.map(({ table, count }) => (
            <div key={table} className="bg-card border border-border rounded-xl px-4 py-3">
              <p className="text-xl font-bold">{count.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {TABLE_LABELS[table] ?? table}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Cache Revalidation ─────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Cache Revalidation
        </h2>
        <p className="text-sm text-muted-foreground">
          Force-revalidate ISR cached pages. Use this after bulk changes or if the site isn&apos;t showing updated content.
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
          {REVALIDATE_GROUPS.map(({ label, description, paths }) => {
            const isLoading = revalidating === label;
            const isDone    = revalidated === label;
            return (
              <div key={label} className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3">
                <div>
                  <p className="font-medium text-sm">{label}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
                </div>
                <Button
                  size="sm"
                  variant={isDone ? "default" : "outline"}
                  disabled={isLoading}
                  onClick={() => handleRevalidate(label, paths)}
                  className="mt-auto"
                >
                  {isLoading ? (
                    <><RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> Revalidating…</>
                  ) : isDone ? (
                    <><CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Done!</>
                  ) : (
                    <><RefreshCw className="w-3.5 h-3.5 mr-1.5" /> Revalidate</>
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Log Cleanup ────────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold flex items-center gap-2">
          <Trash2 className="w-4 h-4" /> Log Cleanup
        </h2>
        <p className="text-sm text-muted-foreground">
          Remove old activity log entries to keep the table lean.
        </p>
        <div className="flex flex-wrap gap-3">
          {[30, 60, 90].map((days) => (
            <Button
              key={days}
              variant="outline"
              size="sm"
              disabled={clearing}
              onClick={() => handleClearLogs(days)}
            >
              {clearing ? <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5 mr-1.5" />}
              Clear logs &gt; {days} days
            </Button>
          ))}
        </div>
        {clearResult && (
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" /> {clearResult}
          </p>
        )}
      </section>

      {/* ── Supabase Links ─────────────────────────────────────────────────── */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold">Quick Links</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { label: "Table Editor", path: "editor/default" },
            { label: "SQL Editor",   path: "sql/new" },
            { label: "Auth Users",   path: "auth/users" },
            { label: "Storage",      path: "storage/buckets" },
            { label: "API Docs",     path: "api/default" },
            { label: "Logs",         path: "logs/explorer" },
          ].map(({ label, path }) => (
            <a
              key={label}
              href={`https://supabase.com/dashboard/project/kxhmxqtxlsyezkmzdjyk/${path}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline underline-offset-2 hover:opacity-80"
            >
              {label} ↗
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
