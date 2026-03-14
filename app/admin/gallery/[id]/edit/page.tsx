"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { galleryMediaApi, formatApiErrorMessage, fetchGalleryMediaCategoryOptions, type GalleryMediaItem } from "@/lib/api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

function imageUrl(item: GalleryMediaItem | null): string {
  if (!item) return "";
  const url = item.image_url ?? item.image_path;
  if (typeof url === "string" && url.startsWith("http")) return url;
  if (typeof url === "string" && url && API_BASE)
    return `${API_BASE.replace(/\/$/, "")}/storage/${url.replace(/^storage\/?/, "")}`;
  return typeof url === "string" ? url : "";
}

export default function AdminGalleryEditPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const id = Number(params.id);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [item, setItem] = useState<GalleryMediaItem | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchGalleryMediaCategoryOptions().then(setCategoryOptions);
  }, []);

  useEffect(() => {
    if (!token || !id || Number.isNaN(id)) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    galleryMediaApi
      .get(token, id)
      .then((d) => {
        if (cancelled) return;
        setItem(d);
        setTitle(d.title ?? "");
        setCategory(d.category ?? "");
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(formatApiErrorMessage(err));
          router.push("/admin/gallery");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token, id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le titre est obligatoire.");
      return;
    }
    if (!token) {
      toast.error("Authentification requise.");
      return;
    }
    setSaving(true);
    try {
      await galleryMediaApi.update(
        token,
        id,
        { title: title.trim(), category: category.trim() || undefined, remove_image: removeImage },
        imageFile ?? undefined
      );
      toast.success("Photo mise à jour.");
      router.push("/admin/gallery");
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setRemoveImage(false);
    }
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);
      setRemoveImage(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

  const currentImageSrc = imageFile ? URL.createObjectURL(imageFile) : (removeImage ? "" : imageUrl(item));

  if (loading) {
    return (
      <div className="max-w-2xl">
        <div className="mb-6">
          <Link href="/admin/gallery" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Retour à la galerie
          </Link>
        </div>
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (!item) {
    return null;
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la galerie
        </Link>
      </div>

      <AdminPageHeader
        title="Modifier la photo"
        description={item.title}
        action={
          <AdminButton href="/admin/gallery" variant="outline" icon={<ArrowLeft className="w-4 h-4" />}>
            Annuler
          </AdminButton>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground">Détails</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Titre *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Formation communautaire"
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Catégorie</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary bg-white"
              >
                <option value="">— Choisir —</option>
                {[
                  ...(category.trim() && !categoryOptions.some((c) => c.name === category)
                    ? [{ id: 0, name: category }]
                    : []),
                  ...categoryOptions,
                ].map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {categoryOptions.length === 0 && !category && (
                <p className="text-xs text-muted-foreground mt-1">
                  Aucune catégorie. Ajoutez-en dans Paramètres → Contenu → Catégories de la galerie.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={onFileChange}
                className="sr-only"
                aria-label="Choisir une image"
              />
              {currentImageSrc ? (
                <div className="space-y-2">
                  <img
                    src={currentImageSrc}
                    alt={title}
                    className="w-full max-w-xs aspect-video object-cover rounded-lg border border-border"
                  />
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm font-medium text-brand-primary hover:underline"
                    >
                      Remplacer l&apos;image
                    </button>
                    {!removeImage && (item.image_path || item.image_url) && (
                      <button
                        type="button"
                        onClick={() => {
                          setRemoveImage(true);
                          setImageFile(null);
                        }}
                        className="text-sm font-medium text-red-600 hover:underline"
                      >
                        Supprimer l&apos;image
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragLeave={onDragLeave}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                    dragOver ? "border-brand-primary bg-brand-primary/5" : "border-border hover:border-brand-primary/30"
                  }`}
                >
                  <p className="text-sm text-muted-foreground mb-2">
                    Glissez une image ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP. Max 2 Mo.</p>
                </div>
              )}
              {removeImage && (
                <p className="text-sm text-amber-600 mt-1">L&apos;image actuelle sera supprimée à l&apos;enregistrement.</p>
              )}
            </div>
          </div>
        </AdminCard>

        <div className="flex gap-4">
          <AdminButton type="submit" disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </AdminButton>
          <AdminButton href="/admin/gallery" variant="outline">Annuler</AdminButton>
        </div>
      </form>
    </div>
  );
}
