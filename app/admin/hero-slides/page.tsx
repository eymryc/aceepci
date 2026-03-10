"use client";

import { useState, useEffect, useCallback } from "react";
import { ImageIcon, Plus, Pencil, Trash2, RefreshCw, Upload, X, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import type { HeroSlide } from "@/lib/api";
import { heroSlidesApi } from "@/lib/api";

const defaultSlide = {
  title: "",
  image: "",
  eyebrow: "",
  subtitle: "",
  description: "",
  order: 0,
};

export default function HeroSlidesPage() {
  const { token } = useAuth();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [form, setForm] = useState<Record<string, string | number | null>>(defaultSlide);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<HeroSlide | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishConfirm, setPublishConfirm] = useState<{ slide: HeroSlide; publish: boolean } | null>(null);
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const fetchSlides = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await heroSlidesApi.list(token);
      setSlides(res.data ?? []);
    } catch {
      setSlides([]);
      toast.error("Erreur lors du chargement des slides");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const setFormField = (field: string, value: string | number | null) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  const openAdd = () => {
    setEditing(null);
    setForm(defaultSlide);
    setFormError(null);
    setImageFile(null);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const openEdit = (slide: HeroSlide) => {
    setEditing(slide);
    setForm({
      title: slide.title,
      image: slide.image,
      eyebrow: slide.eyebrow ?? "",
      subtitle: slide.subtitle ?? "",
      description: slide.description ?? "",
      order: slide.order ?? 0,
    });
    setFormError(null);
    setImageFile(null);
    setImagePreview(slide.image || null);
    setDialogOpen(true);
  };

  const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (JPG, PNG, etc.)");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("L'image ne doit pas dépasser 2 Mo.");
      setFormError("L'image ne doit pas dépasser 2 Mo.");
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError(null);
    e.target.value = "";
  };

  const clearImage = () => {
    setImageFile(null);
    setFormField("image", "");
    if (imagePreview && imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImagePreview(null);
  };

  const validate = () => {
    if (!String(form.title ?? "").trim()) return "Le titre est requis.";
    if (!editing && !imageFile) return "Veuillez téléverser une image.";
    return null;
  };

  const handleSave = async () => {
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    if (!token) return;
    setSaving(true);
    setFormError(null);
    try {
      if (editing) {
        await heroSlidesApi.update(token, editing.id, form, imageFile || undefined);
        toast.success("Slide modifié");
      } else {
        await heroSlidesApi.create(token, form, imageFile || undefined);
        toast.success("Slide ajouté");
      }
      setDialogOpen(false);
      fetchSlides();
    } catch (e: unknown) {
      const msg = e && typeof e === "object" && "message" in e ? String((e as { message: string }).message) : "Erreur lors de l'enregistrement";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting || !token) return;
    setDeleteLoading(true);
    try {
      await heroSlidesApi.delete(token, deleting.id);
      toast.success("Slide supprimé");
      setDeleteOpen(false);
      setDeleting(null);
      fetchSlides();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openPublishConfirm = (slide: HeroSlide, publish: boolean) => {
    setPublishConfirm({ slide, publish });
    setPublishOpen(true);
  };

  const handlePublish = async () => {
    if (!publishConfirm || !token) return;
    const { slide, publish } = publishConfirm;
    setPublishingId(slide.id);
    try {
      await heroSlidesApi.publish(token, slide.id, publish);
      toast.success(publish ? "Slide publié" : "Slide dépublié");
      setPublishOpen(false);
      setPublishConfirm(null);
      setSlides((prev) =>
        prev.map((s) => (s.id === slide.id ? { ...s, is_published: publish } : s))
      );
    } catch {
      toast.error("Erreur lors de la publication");
    } finally {
      setPublishingId(null);
    }
  };

  const fields = [
    { key: "title", label: "Titre", placeholder: "Ex: Association Chrétienne...", type: "text" as const },
    { key: "eyebrow", label: "Sous-titre court (eyebrow)", placeholder: "ACEEPCI · Depuis 1961", type: "text" as const },
    { key: "subtitle", label: "Sous-titre", placeholder: "Connaître — Aimer — Servir", type: "text" as const },
    { key: "description", label: "Description", placeholder: "Gagner l'école ivoirienne à Christ...", type: "textarea" as const },
    { key: "order", label: "Ordre d'affichage", placeholder: "0", type: "number" as const },
  ];

  return (
    <div>
      <AdminPageHeader
        title="Slides de la bannière"
        description="Gestion des slides affichés sur la page d'accueil"
      />
      <AdminCard padding="none">
        <div className="p-4 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between border-b border-border">
          <p className="text-sm text-muted-foreground">
            {slides.length} slide{slides.length !== 1 ? "s" : ""}
          </p>
          <div className="flex gap-2">
            <AdminButton variant="primary" icon={<Plus className="w-4 h-4" />} onClick={openAdd}>
              Ajouter un slide
            </AdminButton>
            <AdminButton
              variant="outline"
              icon={<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />}
              onClick={fetchSlides}
              disabled={loading}
            >
              Rafraîchir
            </AdminButton>
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-12 text-center text-muted-foreground">Chargement...</div>
          ) : slides.length === 0 ? (
            <div className="px-6 py-12 text-center text-muted-foreground">
              Aucun slide. Cliquez sur &quot;Ajouter un slide&quot; pour commencer.
            </div>
          ) : (
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Titre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Sous-titre court</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Sous-titre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Ordre</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Statut</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                </tr>
              </thead>
              <tbody>
                {slides.map((slide) => (
                  <tr key={slide.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div className="w-16 h-10 rounded overflow-hidden bg-slate-100">
                        {slide.image ? (
                          <img src={slide.image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-slate-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground max-w-[180px]">
                      <span className="block truncate" title={slide.title}>{slide.title}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-[140px]">
                      <span className="block truncate" title={slide.eyebrow ?? ""}>{slide.eyebrow ?? "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-[160px]">
                      <span className="block truncate" title={slide.subtitle ?? ""}>{slide.subtitle ?? "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground max-w-[200px]">
                      <span className="block truncate" title={slide.description ?? ""}>{slide.description ?? "—"}</span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{slide.order ?? 0}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${(slide.is_published ?? false) ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>
                        {(slide.is_published ?? false) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        {(slide.is_published ?? false) ? "Publié" : "Brouillon"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openPublishConfirm(slide, !(slide.is_published ?? false))}
                          disabled={publishingId === slide.id}
                          className={`p-2 rounded-lg transition-colors ${(slide.is_published ?? false) ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"}`}
                          title={(slide.is_published ?? false) ? "Dépublier" : "Publier"}
                        >
                          {publishingId === slide.id ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (slide.is_published ?? false) ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => openEdit(slide)}
                          className="p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-subtle rounded-lg"
                          title="Modifier"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => { setDeleting(slide); setDeleteOpen(true); }}
                          className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </AdminCard>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Modifier le slide" : "Ajouter un slide"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {formError && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{formError}</p>
            )}

            {/* Image upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Image *</label>
              <div className="space-y-2">
                <div className="w-full h-32 rounded-lg border-2 border-dashed border-border bg-slate-50 flex items-center justify-center overflow-hidden relative group">
                  <p className="absolute bottom-1 left-2 text-[0.65rem] text-muted-foreground">Max 2 Mo</p>
                  {imagePreview || form.image ? (
                    <>
                      <img
                        src={imagePreview || String(form.image)}
                        alt="Aperçu"
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <label className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Upload className="w-6 h-6 text-white" />
                        <span className="text-sm text-white">Changer</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500/90 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Supprimer l'image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 p-4 cursor-pointer w-full h-full hover:bg-slate-100 transition-colors">
                      <Upload className="w-10 h-10 text-slate-400" />
                      <span className="text-sm text-muted-foreground text-center">
                        Cliquez ou glissez une image
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
                {editing && (
                  <p className="text-xs text-muted-foreground">
                    Laissez vide pour conserver l&apos;image actuelle.
                  </p>
                )}
              </div>
            </div>

            {fields.map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-foreground mb-2">{label}</label>
                {type === "textarea" ? (
                  <textarea
                    value={String(form[key] ?? "")}
                    onChange={(e) => setFormField(key, e.target.value)}
                    placeholder={placeholder}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                ) : (
                  <input
                    type={type}
                    value={String(form[key] ?? "")}
                    onChange={(e) => setFormField(key, type === "number" ? (e.target.value ? parseInt(e.target.value, 10) : 0) : e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter className="justify-center sm:justify-center">
            <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              Annuler
            </button>
            <AdminButton onClick={handleSave} disabled={saving}>
              {saving ? "Enregistrement..." : "Enregistrer"}
            </AdminButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={publishOpen} onOpenChange={(open) => { setPublishOpen(open); if (!open) setPublishConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {publishConfirm?.publish ? "Publier ce slide ?" : "Dépublier ce slide ?"}
            </AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              {publishConfirm?.publish
                ? `"${publishConfirm.slide.title}" sera visible sur la page d'accueil.`
                : `"${publishConfirm?.slide.title}" ne sera plus affiché sur la page d'accueil.`}
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center sm:justify-center">
            <AlertDialogCancel disabled={publishingId !== null}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePublish}
              disabled={publishingId !== null}
              className={publishConfirm?.publish ? "bg-green-600 hover:bg-green-700" : "bg-amber-600 hover:bg-amber-700"}
            >
              {publishingId !== null ? "En cours..." : publishConfirm?.publish ? "Publier" : "Dépublier"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce slide ?</AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              &quot;{deleting?.title}&quot; sera définitivement supprimé.
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter className="justify-center sm:justify-center">
            <AlertDialogCancel disabled={deleteLoading}>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleteLoading} className="bg-red-600 hover:bg-red-700">
              {deleteLoading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
