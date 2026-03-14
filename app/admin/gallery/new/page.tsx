"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { galleryMediaApi, formatApiErrorMessage, fetchGalleryMediaCategoryOptions } from "@/lib/api";

export default function AdminGalleryNewPage() {
  const router = useRouter();
  const { token } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [categoryOptions, setCategoryOptions] = useState<{ id: number; name: string }[]>([]);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    fetchGalleryMediaCategoryOptions().then(setCategoryOptions);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Le titre est obligatoire.");
      return;
    }
    if (!imageFile) {
      toast.error("Veuillez sélectionner une image.");
      return;
    }
    if (!token) {
      toast.error("Authentification requise.");
      return;
    }
    setSubmitting(true);
    try {
      await galleryMediaApi.create(token, {
        title: title.trim(),
        category: category.trim() || undefined,
      }, imageFile);
      toast.success("Photo ajoutée à la galerie.");
      router.push("/admin/gallery");
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) setImageFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) setImageFile(file);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => setDragOver(false);

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
        title="Ajouter une photo"
        description="Nouvelle photo pour la galerie média"
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
                {categoryOptions.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              {categoryOptions.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">
                  Aucune catégorie. Ajoutez-en dans Paramètres → Contenu → Catégories de la galerie.
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Image *</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                onChange={onFileChange}
                className="sr-only"
                aria-label="Choisir une image"
              />
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
                {imageFile ? (
                  <>
                    <p className="text-sm font-medium text-foreground">{imageFile.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Cliquez ou glissez une autre image pour remplacer</p>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">
                      Glissez une image ou cliquez pour parcourir
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WebP. Max 2 Mo.</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </AdminCard>

        <div className="flex gap-4">
          <AdminButton type="submit" disabled={submitting}>
            {submitting ? "Ajout..." : "Ajouter"}
          </AdminButton>
          <AdminButton href="/admin/gallery" variant="outline">Annuler</AdminButton>
        </div>
      </form>
    </div>
  );
}
