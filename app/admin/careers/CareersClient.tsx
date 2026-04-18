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
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import {
  deleteJobPosting,
  reorderJobPostings,
  updateJobPosting,
  markApplicationRead,
  deleteApplication,
  getApplicationDocumentUrl,
} from "./actions";
import type { JobPosting, JobApplication } from "./page";
import { Button } from "@/components/ui/button";

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
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          Job Postings
          <span className="ml-1.5 text-xs opacity-70">
            {initialPostings.length}
          </span>
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            tab === "applications"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
        <Button asChild size="sm">
          <Link href="/admin/careers/new">
            <Plus className="w-4 h-4 mr-1" />
            Add Job
          </Link>
        </Button>
      </div>

      {postings.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm mb-4">No job postings yet.</p>
          <Button asChild size="sm">
            <Link href="/admin/careers/new">Add your first job</Link>
          </Button>
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
                className={`flex items-center gap-4 bg-card border border-border rounded-xl px-5 py-4 transition-all ${
                  isDragging ? "opacity-40" : "opacity-100"
                } ${isDragOver ? "border-primary" : ""}`}
              >
                <div className="shrink-0 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground transition-colors">
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className={`text-sm font-semibold truncate ${
                        posting.is_published ? "" : "text-muted-foreground"
                      }`}
                    >
                      {posting.title}
                    </p>
                    {!posting.is_published && (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                        Draft
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {posting.location} · {posting.employment_type}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0 ml-2">
                  {isConfirming ? (
                    <>
                      <span className="text-xs text-muted-foreground mr-1 hidden sm:block">
                        Delete?
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmDeleteId(null)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(posting.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Deleting…" : "Confirm"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTogglePublished(posting)}
                        disabled={isLoading}
                        title={posting.is_published ? "Unpublish" : "Publish"}
                      >
                        {posting.is_published ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </Button>
                      <Button size="sm" variant="ghost" asChild title="Edit">
                        <Link href={`/admin/careers/${posting.id}`}>
                          <Pencil className="w-3.5 h-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmDeleteId(posting.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive" />
                      </Button>
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
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
          }`}
        >
          All
          <span className="ml-1.5 text-xs opacity-70">
            {applications.length}
          </span>
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            filter === "unread"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground hover:bg-secondary"
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
        <div className="text-center py-16 text-muted-foreground">
          <MailOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p className="text-sm">
            {filter === "unread"
              ? "No unread applications."
              : "No applications yet."}
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
                  ? "bg-card border-border"
                  : "bg-primary/5 border-primary/30"
              }`}
            >
              <button
                onClick={() => handleExpand(app)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              >
                <div className="shrink-0 mt-0.5">
                  {app.is_read ? (
                    <MailOpen className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Mail className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span
                      className={`text-sm font-medium truncate ${
                        app.is_read
                          ? "text-muted-foreground"
                          : "text-foreground"
                      }`}
                    >
                      {app.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate hidden sm:block">
                      {app.email}
                    </span>
                    <span className="text-[10px] font-medium text-muted-foreground bg-secondary border border-border rounded px-1.5 py-0.5 hidden md:block">
                      {app.position}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">
                    {app.message}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-2">
                  <span className="text-xs text-muted-foreground hidden sm:block whitespace-nowrap">
                    {formatDate(app.created_at)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-border">
                  <div className="pt-4 grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        Name
                      </p>
                      <p className="text-sm">{app.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${app.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {app.email}
                      </a>
                    </div>
                    {app.phone && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                          Phone
                        </p>
                        <a href={`tel:${app.phone}`} className="text-sm">
                          {app.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        Position
                      </p>
                      <p className="text-sm">{app.position}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                        Received
                      </p>
                      <p className="text-sm">{formatDate(app.created_at)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                      Cover Letter / Message
                    </p>
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                      {app.message}
                    </p>
                  </div>

                  {app.document_urls.length > 0 && (
                    <div className="mt-5">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">
                        Attachments
                      </p>
                      <ul className="space-y-1.5">
                        {app.document_urls.map((path) => (
                          <DocumentRow key={path} path={path} />
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-border">
                    {isConfirming ? (
                      <>
                        <span className="text-sm text-muted-foreground mr-1">
                          Delete this application?
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(app.id)}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting…" : "Confirm Delete"}
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmDeleteId(app.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5 text-destructive mr-1.5" />
                        Delete
                      </Button>
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

// ── Document Row ──────────────────────────────────────────────

function DocumentRow({ path }: { path: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const filename = path.split("/").pop()?.replace(/^\d+-[a-z0-9]+-/i, "") ?? path;

  async function handleOpen() {
    setLoading(true);
    setError(null);
    const result = await getApplicationDocumentUrl(path);
    setLoading(false);
    if (result.error || !result.url) {
      setError(result.error ?? "Could not open document.");
      return;
    }
    window.open(result.url, "_blank", "noopener,noreferrer");
  }

  return (
    <li>
      <button
        type="button"
        onClick={handleOpen}
        disabled={loading}
        className="w-full flex items-center gap-2 bg-secondary hover:bg-secondary/80 border border-border rounded-lg px-3 py-2 text-sm text-left transition-colors disabled:opacity-60"
      >
        <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
        <span className="flex-1 truncate">{filename}</span>
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground shrink-0" />
        ) : (
          <Download className="w-4 h-4 text-muted-foreground shrink-0" />
        )}
      </button>
      {error && (
        <p className="text-xs text-destructive mt-1 px-3">{error}</p>
      )}
    </li>
  );
}
