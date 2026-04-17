"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, MailOpen, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { markMessageRead, deleteMessage } from "./actions";
import type { Message } from "./page";

export default function MessagesClient({ messages }: { messages: Message[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const unreadCount = messages.filter((m) => !m.is_read).length;
  const visible = filter === "unread" ? messages.filter((m) => !m.is_read) : messages;

  async function handleExpand(msg: Message) {
    if (expandedId === msg.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(msg.id);
    if (!msg.is_read) {
      await markMessageRead(msg.id);
      router.refresh();
    }
  }

  async function handleDelete(id: string) {
    setLoadingId(id);
    await deleteMessage(id);
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
      {/* Filter tabs */}
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
          <span className="ml-1.5 text-xs opacity-70">{messages.length}</span>
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
            {filter === "unread" ? "No unread messages." : "No messages yet."}
          </p>
        </div>
      )}

      <div className="space-y-2">
        {visible.map((msg) => {
          const isExpanded = expandedId === msg.id;
          const isConfirming = confirmDeleteId === msg.id;
          const isDeleting = loadingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`rounded-xl border transition-colors ${
                msg.is_read
                  ? "bg-zinc-900 border-zinc-800"
                  : "bg-zinc-800/70 border-zinc-700"
              }`}
            >
              {/* Row header */}
              <button
                onClick={() => handleExpand(msg)}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {msg.is_read ? (
                    <MailOpen className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <Mail className="w-4 h-4 text-accent" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    <span
                      className={`text-sm font-medium truncate ${
                        msg.is_read ? "text-zinc-300" : "text-white"
                      }`}
                    >
                      {msg.name}
                    </span>
                    <span className="text-xs text-zinc-500 truncate hidden sm:block">
                      {msg.email}
                    </span>
                    <span className="text-[10px] font-medium text-zinc-400 bg-zinc-800 border border-zinc-700 rounded px-1.5 py-0.5 hidden md:block">
                      {msg.enquiry_type}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{msg.message}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-2">
                  <span className="text-xs text-zinc-600 hidden sm:block whitespace-nowrap">
                    {formatDate(msg.created_at)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-500" />
                  )}
                </div>
              </button>

              {/* Expanded */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-zinc-700/50">
                  <div className="pt-4 grid sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Name</p>
                      <p className="text-sm text-zinc-200">{msg.name}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Email</p>
                      <a
                        href={`mailto:${msg.email}`}
                        className="text-sm text-accent hover:underline"
                      >
                        {msg.email}
                      </a>
                    </div>
                    {msg.phone && (
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Phone</p>
                        <a href={`tel:${msg.phone}`} className="text-sm text-zinc-200">
                          {msg.phone}
                        </a>
                      </div>
                    )}
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Enquiry Type</p>
                      <p className="text-sm text-zinc-200">{msg.enquiry_type}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Received</p>
                      <p className="text-sm text-zinc-200">{formatDate(msg.created_at)}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-1">Message</p>
                    <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
                      {msg.message}
                    </p>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-zinc-800">
                    {isConfirming ? (
                      <>
                        <span className="text-sm text-zinc-400 mr-1">Delete this message?</span>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="text-xs text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleDelete(msg.id)}
                          disabled={isDeleting}
                          className="text-xs text-white bg-destructive hover:bg-destructive/90 px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting…" : "Confirm Delete"}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteId(msg.id)}
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
