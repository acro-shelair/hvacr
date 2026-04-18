"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import * as Icons from "lucide-react";
import { GripVertical, Pencil, Trash2, Package, Eye, EyeOff } from "lucide-react";
import { deleteBrand, reorderBrands, updateBrand } from "./actions";
import type { Brand } from "./page";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Ic = (Icons as Record<string, unknown>)[name] as React.ComponentType<{ className?: string }> | undefined;
  if (!Ic) return null;
  return <Ic className={className} />;
}

export default function BrandsClient({ brands: initial }: { brands: Brand[] }) {
  const router = useRouter();
  const [brands, setBrands] = useState(initial);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setLoadingId(id);
    await deleteBrand(id);
    setBrands((prev) => prev.filter((b) => b.id !== id));
    setConfirmDeleteId(null);
    setLoadingId(null);
    router.refresh();
  }

  async function handleTogglePublished(brand: Brand) {
    setLoadingId(brand.id);
    const next = !brand.is_published;
    setBrands((prev) =>
      prev.map((b) => (b.id === brand.id ? { ...b, is_published: next } : b))
    );
    await updateBrand(brand.id, { is_published: next });
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

    const from = brands.findIndex((b) => b.id === draggingId);
    const to = brands.findIndex((b) => b.id === targetId);
    const reordered = [...brands];
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    setBrands(reordered);
    setDraggingId(null);
    setDragOverId(null);

    await reorderBrands(reordered.map((b) => b.id));
    router.refresh();
  }

  if (brands.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm mb-4">No brands yet.</p>
        <Button asChild size="sm">
          <Link href="/admin/brands/new">Add your first brand</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {brands.map((brand) => {
        const isConfirming = confirmDeleteId === brand.id;
        const isLoading = loadingId === brand.id;
        const isDragOver = dragOverId === brand.id;
        const isDragging = draggingId === brand.id;

        return (
          <div
            key={brand.id}
            draggable
            onDragStart={() => handleDragStart(brand.id)}
            onDragOver={(e) => handleDragOver(e, brand.id)}
            onDrop={() => handleDrop(brand.id)}
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

            <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 overflow-hidden flex items-center justify-center">
              {brand.logo_url ? (
                <Image
                  src={brand.logo_url}
                  alt={brand.name}
                  width={40}
                  height={40}
                  className="object-contain w-full h-full"
                />
              ) : brand.icon ? (
                <DynamicIcon name={brand.icon} className="w-5 h-5 text-primary" />
              ) : (
                <span className="text-primary font-bold text-sm">{brand.name[0]}</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className={`text-sm font-semibold truncate ${brand.is_published ? "" : "text-muted-foreground"}`}>
                  {brand.name}
                </p>
                {!brand.is_published && (
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                    Draft
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {brand.specialty}
                {brand.website_url ? ` · ${brand.website_url}` : ""}
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
                    onClick={() => handleDelete(brand.id)}
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
                    onClick={() => handleTogglePublished(brand)}
                    disabled={isLoading}
                    title={brand.is_published ? "Unpublish" : "Publish"}
                  >
                    {brand.is_published ? (
                      <Eye className="w-4 h-4" />
                    ) : (
                      <EyeOff className="w-4 h-4" />
                    )}
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/brands/${brand.id}`} title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setConfirmDeleteId(brand.id)}
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
