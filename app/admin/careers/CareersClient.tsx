"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  GripVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Briefcase,
  Mail,
  MailOpen,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react";
import {
  deleteJobPosting,
  reorderJobPostings,
  updateJobPosting,
  markApplicationRead,
  deleteApplication,
} from "./actions";
import type { JobPosting, JobApplication } from "./page";

type Tab = "postings" | "applications";

export default function CareersClient({
  postings: initialPostings,
  applications,
}: {
  postings: JobPosting[];
  applications: JobApplication[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("postings");

  const unreadCount = applications.filter((a) => !a.is_read).length;

  return (
    <div>
      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setTab("postings")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "postings"
              ? "bg-accent text-accent-foreground"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          Job Postings
          <span className="ml-1.5 text-xs opacity-70">{initialPostings.length}</span>
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "applications"
              ? "bg-accent text-accent-foreground"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          Applications
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {tab === "postings" && (
        <PostingsTab postings={initialPostings} router={router} />
      )}
      {tab === "applications" && (
        <ApplicationsTab applications={applications} router={router} />
      )}
    </div>
  );
}

// ── Postings Tab ──────────────────────────────────────────────

function PostingsTab({
  postings: initial,
  router,
}: {
  postings: JobPosting[];
  router: ReturnType<typeof useRouter>;
}) {
  const [postings, setPostings] = useState(initial);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    await deleteJobPosting(id);
    setPostings((prev) => prev.filter((p) => p.id !== id));
    setConfirmDeleteId(null);
    setLoadingId(null);
    router.refresh();
  }

  async function handleTogglePublished(posting: JobPosting) {
    setLoadingId(posting.id);
    const next = !posting.is_published;
    setPostings((prev) =>
      prev.map((p) => (p.id === posting.id ? { ...p, is_published: next } : p))
    );
    await updateJobPosting(posting.id, { is_published: next });
    setLoadingId(null);
    router.refresh();
  }

  function handleDragStart(id: string) {
    setDraggingId(id);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (id !== draggingId) setDragOverId(id);
  }

  async function handleDrop(targetId: string) {
    if (!draggingId || draggingId === targetId) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const from = postings.findIndex((p) => p.id === draggingId);
    const to = postings.findIndex((p) => p.id === targetId);
    const reordered = [...postings];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    setPostings(reordered);
    setDraggingId(null);
    setDragOverId(null);

    await reorderJobPostings(reordered.map((p) => p.id));
    router.refresh();
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Link
          href="/admin/careers/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </Link>
      </div>

      {postings.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm mb-4">No job postings yet.</p>
          <Link
            href="/admin/careers/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
          >
            Add your first job
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {postings.map((posting) => {
            const isConfirming = confirmDeleteId === posting.id;
            const isLoading = loadingId === posting.id;
            const isDragOver = dragOverId === posting.id;
            const isDragging = draggingId === posting.id;

            return (
              <div
                key={posting.id}
                draggable
                onDragStart={() => handleDragStart(posting.id)}
                onDragOver={(e) => handleDragOver(e, posting.id)}
                onDrop={() => handleDrop(posting.id)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setDragOverId(null);
                }}
                className={`rounded-xl border bg-zinc-900 transition-all ${
                  isDragging ? "opacity-40" : "opacity-100"
                } ${isDragOver ? "border-accent" : "border-zinc-800"}`}
              >
                <div className="flex items-center gap-3 px-4 py-3.5">
                  <div className="shrink-0 cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 transition-colors">
                    <GripVertical className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p
                        className={`text-sm font-medium truncate ${
                          posting.is_published ? "text-white" : "text-zinc-500"
                        }`}
                      >
                        {posting.title}
                      </p>
                      {!posting.is_published && (
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                          Draft
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-zinc-500 truncate mt-0.5">
                      {posting.location} · {posting.employment_type}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    {isConfirming ? (
                      <>
                        <span className="text-xs text-zinc-400 mr-1 hidden sm:block">Delete?</span>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(posting.id)}
                          disabled={isLoading}
                          className="text-xs text-white bg-destructive hover:bg-destructive/90 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isLoading ? "Deleting…" : "Confirm"}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleTogglePublished(posting)}
                          disabled={isLoading}
                          title={posting.is_published ? "Unpublish" : "Publish"}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40"
                        >
                          {posting.is_published ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <Link
                          href={`/admin/careers/${posting.id}`}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setConfirmDeleteId(posting.id)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-destructive hover:bg-zinc-800 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── Applications Tab ──────────────────────────────────────────

function ApplicationsTab({
  applications,
  router,
}: {
  applications: JobApplication[];
  router: ReturnType<typeof useRouter>;
}) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const unreadCount = applications.filter((a) => !a.is_read).length;
  const visible =
    filter === "unread" ? applications.filter((a) => !a.is_read) : applications;

  async function handleExpand(app: JobApplication) {
    if (expandedId === app.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(app.id);
    if (!app.is_read) {
      await markApplicationRead(app.id);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    setLoadingId(id);
    await deleteApplication(id);
    router.refresh();
    setLoadingId(null);
    setConfirmDeleteId(null);
    if (expandedId === id) setExpandedId(null);
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "all"
              ? "bg-accent text-accent-foreground"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          All
          <span className="ml-1.5 text-xs opacity-70">{applications.length}</span>
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "unread"
              ? "bg-accent text-accent-foreground"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          Unread
          {unreadCount > 0 && (
            <span className="text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full w-4 h-4 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {visible.length === 0 && (
        <div className="text-center py-16 text-zinc-500">
          <MailOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            {filter === "unread" ? "No unread applications." : "No applications yet."}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {visible.map((app) => {
          const isExpanded = expandedId === app.id;
          const isConfirming = confirmDeleteId === app.id;
          const isDeleting = loadingId === app.id;

          return (
            <div
              key={app.id}
              className={`rounded-xl border transition-colors ${
                app.is_read
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-zinc-800/70 border-zinc-700"
              }`}
            >
              <button
                onClick={() => handleExpand(app)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {app.is_read ? (
                    <MailOpen className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <Mail className="w-4 h-4 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span
                      className={`text-sm font-medium truncate ${
                        app.is_read ? "text-zinc-300" : "text-white"
                      }`}
                    >
                      {app.name}
                    </span>
                    <span className="text-xs text-zinc-500 truncate hidden sm:block">
                      {app.email}
                    </span>
                    <span className="text-[10px] font-medium text-zinc-400 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 hidden md:block">
                      {app.position}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{app.message}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span className="text-xs text-zinc-600 hidden sm:block whitespace-nowrap">
                    {formatDate(app.created_at)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-700/50">
                  <div className="pt-4 grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Name</p>
                      <p className="text-sm text-zinc-200">{app.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Email</p>
                      <a
                        href={`mailto:${app.email}`}
                        className="text-sm text-accent hover:underline"
                      >
                        {app.email}
                      </a>
                    </div>
                    {app.phone && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Phone</p>
                        <a href={`tel:${app.phone}`} className="text-sm text-zinc-200">
                          {app.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Position</p>
                      <p className="text-sm text-zinc-200">{app.position}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Received</p>
                      <p className="text-sm text-zinc-200">{formatDate(app.created_at)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Cover Letter / Message</p>
                    <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                      {app.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-zinc-800">
                    {isConfirming ? (
                      <>
                        <span className="text-sm text-zinc-400 mr-1">Delete this application?</span>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(app.id)}
                          disabled={isDeleting}
                          className="text-xs text-white bg-destructive hover:bg-destructive/90 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting…" : "Confirm Delete"}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(app.id)}
                        className="flex items-center gap-1.5 text-xs text-zinc-500 hover:text-destructive px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
