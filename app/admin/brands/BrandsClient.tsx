"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  GripVertical,
  Pencil,
  Trash2,
  Package,
  Eye,
  EyeOff,
} from "lucide-react";
import { deleteBrand, reorderBrands, updateBrand } from "./actions";
import type { Brand } from "./page";
import Link from "next/link";

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
      <div className="text-center py-16 text-zinc-500">
        <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
        <p className="text-sm mb-4">No brands yet.</p>
        <Link
          href="/admin/brands/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
        >
          Add your first brand
        </Link>
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
            className={`rounded-xl border bg-zinc-900 transition-all ${
              isDragging ? "opacity-40" : "opacity-100"
            } ${isDragOver ? "border-accent" : "border-zinc-800"}`}
          >
            <div className="flex items-center gap-3 px-4 py-3.5">
              <div className="shrink-0 cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-400 transition-colors">
                <GripVertical className="w-4 h-4" />
              </div>

              <div className="shrink-0 w-10 h-10 rounded-lg bg-zinc-800 overflow-hidden flex items-center justify-center">
                {brand.logo_url ? (
                  <Image
                    src={brand.logo_url}
                    alt={brand.name}
                    width={40}
                    height={40}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <Package className="w-5 h-5 text-zinc-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-sm font-medium truncate ${
                      brand.is_published ? "text-white" : "text-zinc-500"
                    }`}
                  >
                    {brand.name}
                  </p>
                  {!brand.is_published && (
                    <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-500 border border-zinc-700">
                      Draft
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 truncate mt-0.5">
                  {brand.specialty || brand.slug}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                {isConfirming ? (
                  <>
                    <span className="text-xs text-zinc-400 mr-1 hidden sm:block">
                      Delete?
                    </span>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="text-xs text-zinc-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(brand.id)}
                      disabled={isLoading}
                      className="text-xs text-white bg-destructive hover:bg-destructive/90 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
                    >
                      {isLoading ? "Deleting…" : "Confirm"}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleTogglePublished(brand)}
                      disabled={isLoading}
                      title={brand.is_published ? "Unpublish" : "Publish"}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors disabled:opacity-40"
                    >
                      {brand.is_published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <Link
                      href={`/admin/brands/${brand.id}`}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-800 transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setConfirmDeleteId(brand.id)}
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
  );
}
