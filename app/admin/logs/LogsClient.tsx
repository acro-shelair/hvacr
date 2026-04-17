"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import type { ActivityLog } from "./page";

const ACTION_BADGE: Record<string, string> = {
  create: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  update: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  delete: "bg-destructive/20 text-destructive border-destructive/30",
  login:  "bg-zinc-700 text-zinc-300 border-zinc-600",
  logout: "bg-zinc-700 text-zinc-300 border-zinc-600",
};

const TABLE_LABEL: Record<string, string> = {
  brands:           "Brands",
  industries:       "Industries",
  messages:         "Messages",
  faqs:             "FAQs",
  job_postings:     "Job Postings",
  job_applications: "Applications",
  site_settings:    "Settings",
  user_profiles:    "Users",
  auth:             "Auth",
};

export default function LogsClient({ logs }: { logs: ActivityLog[] }) {
  const [actionFilter, setActionFilter] = useState("all");
  const [tableFilter, setTableFilter]   = useState("all");

  const actions = ["all", ...Array.from(new Set(logs.map((l) => l.action)))];
  const tables  = ["all", ...Array.from(new Set(logs.map((l) => l.table_name)))];

  const visible = logs.filter((l) => {
    if (actionFilter !== "all" && l.action !== actionFilter) return false;
    if (tableFilter  !== "all" && l.table_name !== tableFilter) return false;
    return true;
  });

  function fmt(iso: string) {
    return new Date(iso).toLocaleString("en-AU", {
      day: "numeric", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  }

  const hasFilter = actionFilter !== "all" || tableFilter !== "all";

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-500 uppercase tracking-wider shrink-0">Action</label>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="text-sm bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-accent"
          >
            {actions.map((a) => (
              <option key={a} value={a}>{a === "all" ? "All actions" : a}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-500 uppercase tracking-wider shrink-0">Section</label>
          <select
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            className="text-sm bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-accent"
          >
            {tables.map((t) => (
              <option key={t} value={t}>
                {t === "all" ? "All sections" : (TABLE_LABEL[t] ?? t)}
              </option>
            ))}
          </select>
        </div>

        {hasFilter && (
          <button
            onClick={() => { setActionFilter("all"); setTableFilter("all"); }}
            className="text-sm text-zinc-500 hover:text-white transition-colors"
          >
            Clear filters
          </button>
        )}

        <span className="ml-auto text-xs text-zinc-600">{visible.length} entries</span>
      </div>

      {visible.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <FileText className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No logs found.</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {visible.map((log) => (
            <div
              key={log.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 flex flex-wrap items-start gap-3"
            >
              <span
                className={`shrink-0 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  ACTION_BADGE[log.action] ?? "bg-zinc-800 text-zinc-400 border-zinc-700"
                }`}
              >
                {log.action}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-200">
                  <span className="font-medium text-zinc-400 mr-2">
                    {TABLE_LABEL[log.table_name] ?? log.table_name}
                  </span>
                  {log.details}
                </p>
                <p className="text-xs text-zinc-600 mt-0.5">
                  {log.user_email ?? "system"} · {fmt(log.created_at)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
