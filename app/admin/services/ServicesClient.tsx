"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical, Pencil, Trash2, Wrench, Eye, EyeOff } from "lucide-react";
import { getServiceIcon } from "@/lib/serviceIcons";
import { deleteService, reorderServices, updateService } from "./actions";
import type { Service } from "./page";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ServicesClient({ initialServices }: { initialServices: Service[] }) {
  const router = useRouter();
  const [services, setServices] = useState(initialServices);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    await deleteService(id);
    setServices((prev) => prev.filter((s) => s.id !== id));
    setConfirmDeleteId(null);
    setLoadingId(null);
    router.refresh();
  }

  async function handleTogglePublished(service: Service) {
    setLoadingId(service.id);
    const next = !service.is_published;
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, is_published: next } : s))
    );
    await updateService(service.id, { is_published: next });
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

    const from = services.findIndex((s) => s.id === draggingId);
    const to = services.findIndex((s) => s.id === targetId);
    const reordered = [...services];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    setServices(reordered);
    setDraggingId(null);
    setDragOverId(null);

    await reorderServices(reordered.map((s) => s.id));
    router.refresh();
  }

  if (services.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Wrench className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm mb-4">No services yet.</p>
        <Button asChild size="sm">
          <Link href="/admin/services/new">Add your first service</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {services.map((service) => {
        const isConfirming = confirmDeleteId === service.id;
        const isLoading = loadingId === service.id;
        const isDragOver = dragOverId === service.id;
        const isDragging = draggingId === service.id;
        const Icon = getServiceIcon(service.icon_name);

        return (
          <div
            key={service.id}
            draggable
            onDragStart={() => handleDragStart(service.id)}
            onDragOver={(e) => handleDragOver(e, service.id)}
            onDrop={() => handleDrop(service.id)}
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
              <Icon className="w-5 h-5 text-primary" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold truncate ${service.is_published ? "" : "text-muted-foreground"}`}>
                  {service.title}
                </p>
                {!service.is_published && (
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                /services/{service.slug}
              </p>
            </div>

            <div className="flex items-center gap-1 shrink-0 ml-2">
              {isConfirming ? (
                <>
                  <span className="text-xs text-muted-foreground mr-1 hidden sm:block">Delete?</span>
                  <Button size="sm" variant="ghost" onClick={() => setConfirmDeleteId(null)}>
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(service.id)}
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
                    onClick={() => handleTogglePublished(service)}
                    disabled={isLoading}
                    title={service.is_published ? "Unpublish" : "Publish"}
                  >
                    {service.is_published ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/services/${service.id}/edit`} title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmDeleteId(service.id)}
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
  );
}
