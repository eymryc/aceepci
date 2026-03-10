"use client";

import { useState, useEffect, useCallback } from "react";
import { Save, BookOpen, History, ImageIcon, Upload, X, RefreshCw, Pencil, Eye, EyeOff, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { dailyVersesApi } from "@/lib/api";
import type { DailyVerse } from "@/lib/api";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

type NormalizedVerse = DailyVerse & { text: string; reference: string; secondaryText?: string; secondaryReference?: string; imageUrl?: string };

const emptyForm = {
  text: "",
  reference: "",
  secondaryText: "",
  secondaryReference: "",
  imageLabel: "",
  imageQuote: "",
};

function formatVerseDate(v: NormalizedVerse): string {
  const d = v.created_at ?? v.updated_at;
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return "—";
  }
}

export default function AdminVersePage() {
  const { token } = useAuth();
  const [history, setHistory] = useState<NormalizedVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editing, setEditing] = useState<NormalizedVerse | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishConfirm, setPublishConfirm] = useState<{ entry: NormalizedVerse; publish: boolean } | null>(null);
  const [publishingId, setPublishingId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [lastPage, setLastPage] = useState(1);
  const displayImage = imagePreview ?? (editing?.imageUrl) ?? null;

  const fetchVerses = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await dailyVersesApi.list(token, { page, per_page: perPage, search: search || undefined });
      setHistory(res.data ?? []);
      setLastPage(res.last_page ?? res.meta?.last_page ?? 1);
    } catch {
      setHistory([]);
      setLastPage(1);
      toast.error("Erreur lors du chargement des versets");
    } finally {
      setLoading(false);
    }
  }, [token, page, perPage, search]);

  useEffect(() => {
    fetchVerses();
  }, [fetchVerses]);

  useEffect(() => {
    if (page > lastPage && lastPage > 0) setPage(lastPage);
  }, [page, lastPage]);

  useEffect(() => {
    setPage(1);
  }, [search, perPage]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image (JPG, PNG, etc.)");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("L'image ne doit pas dépasser 2 Mo.");
      e.target.value = "";
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setFormError(null);
    e.target.value = "";
  };

  const clearImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setFormError(null);
  };

  const handleEdit = (entry: NormalizedVerse) => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setEditing(entry);
    setForm({
      text: entry.text,
      reference: entry.reference,
      secondaryText: entry.secondaryText ?? "",
      secondaryReference: entry.secondaryReference ?? "",
      imageLabel: entry.image_label ?? "",
      imageQuote: entry.image_quote ?? "",
    });
    setImageFile(null);
    setImagePreview(entry.imageUrl ?? null);
    setFormError(null);
  };

  const openPublishConfirm = (entry: NormalizedVerse, publish: boolean) => {
    setPublishConfirm({ entry, publish });
    setPublishOpen(true);
  };

  const handlePublish = async () => {
    if (!publishConfirm || !token) return;
    const { entry, publish } = publishConfirm;
    setPublishingId(entry.id);
    try {
      await dailyVersesApi.publish(token, entry.id, publish);
      toast.success(publish ? "Verset publié" : "Verset dépublié");
      setPublishOpen(false);
      setPublishConfirm(null);
      setHistory((prev) =>
        prev.map((v) => (v.id === entry.id ? { ...v, is_published: publish } : v))
      );
    } catch {
      toast.error("Erreur lors de la publication");
    } finally {
      setPublishingId(null);
    }
  };

  const handleSave = async () => {
    if (!token) return;
    if (!form.text.trim()) {
      setFormError("Le texte du verset principal est requis.");
      toast.error("Le texte du verset principal est requis.");
      return;
    }
    if (!form.reference.trim()) {
      setFormError("La référence biblique est requise.");
      toast.error("La référence biblique est requise.");
      return;
    }
    setSaving(true);
    setFormError(null);
    try {
      const body = {
        text: form.text.trim(),
        reference: form.reference.trim(),
        secondaryText: form.secondaryText?.trim() || undefined,
        secondaryReference: form.secondaryReference?.trim() || undefined,
        imageLabel: form.imageLabel?.trim() || undefined,
        imageQuote: form.imageQuote?.trim() || undefined,
      };
      if (editing) {
        await dailyVersesApi.update(token, editing.id, body, imageFile || undefined);
        toast.success("Verset modifié");
      } else {
        await dailyVersesApi.create(token, body, imageFile || undefined);
        toast.success("Verset créé");
      }
      setImageFile(null);
      setImagePreview(null);
      setEditing(null);
      setForm(emptyForm);
      fetchVerses();
    } catch (e: unknown) {
      const err = e as { message?: string; errors?: Record<string, string[]> };
      const msg = err.message || (err.errors ? Object.values(err.errors).flat().join(" ") : "Erreur lors de l'enregistrement");
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <AdminPageHeader title="Verset du jour" />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1fr] gap-6 xl:gap-8">
        {/* Colonne gauche : formulaire */}
        <div className="space-y-6 min-w-0">
          <AdminCard padding="none">
            <div className="px-6 py-4 border-b border-border bg-slate-50/50">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-primary" />
                Versets
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Principal et secondaire (optionnel) affichés côte à côte
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">Verset principal</label>
                  <textarea
                    rows={4}
                    value={form.text}
                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                    placeholder="Car Dieu a tant aimé le monde..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                  <label className="block text-xs text-muted-foreground">Référence</label>
                  <input
                    type="text"
                    value={form.reference}
                    onChange={(e) => setForm({ ...form, reference: e.target.value })}
                    placeholder="Jean 3:16"
                    className="w-full px-4 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-foreground">Verset secondaire (optionnel)</label>
                  <textarea
                    rows={4}
                    value={form.secondaryText}
                    onChange={(e) => setForm({ ...form, secondaryText: e.target.value })}
                    placeholder="Ne sois pas de ceux qui se détournent..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                  <label className="block text-xs text-muted-foreground">Référence</label>
                  <input
                    type="text"
                    value={form.secondaryReference}
                    onChange={(e) => setForm({ ...form, secondaryReference: e.target.value })}
                    placeholder="Luc 13:23"
                    className="w-full px-4 py-2 text-sm border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard padding="none">
            <div className="px-6 py-4 border-b border-border bg-slate-50/50">
              <h2 className="font-semibold text-foreground flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-primary" />
                Image à côté
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Image affichée à droite du verset sur la page d&apos;accueil
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Image</label>
                <div className="rounded-lg border-2 border-dashed border-border bg-slate-50 overflow-hidden relative group">
                  <p className="absolute top-2 left-2 text-[0.65rem] text-muted-foreground z-10">Max 2 Mo</p>
                  {displayImage && displayImage.trim() ? (
                    <>
                      <div className="w-full h-40 sm:h-48 relative">
                        <img
                          src={displayImage}
                          alt="Aperçu"
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                        <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-white rounded-lg text-sm font-medium text-foreground hover:bg-slate-100">
                          <Upload className="w-4 h-4" />
                          Changer
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
                          className="p-2 rounded-full bg-red-500/90 text-white hover:bg-red-600"
                          title="Supprimer l'image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 p-8 cursor-pointer min-h-[140px] hover:bg-slate-100 transition-colors">
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
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Label (ex. La Parole)</label>
                <input
                  type="text"
                  value={form.imageLabel ?? ""}
                  onChange={(e) => setForm({ ...form, imageLabel: e.target.value })}
                  placeholder="La Parole"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Citation sur l&apos;image</label>
                <input
                  type="text"
                  value={form.imageQuote ?? ""}
                  onChange={(e) => setForm({ ...form, imageQuote: e.target.value })}
                  placeholder="« Ta parole est une lampe à mes pieds »"
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
            </div>
          </AdminCard>

          {formError && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{formError}</p>
          )}

          <div className="flex justify-end gap-2">
            {editing && (
              <AdminButton variant="outline" onClick={openAdd}>
                Nouveau verset
              </AdminButton>
            )}
            <AdminButton onClick={handleSave} icon={<Save className="w-4 h-4" />} disabled={saving}>
              {saving ? "Enregistrement..." : editing ? "Modifier le verset" : "Créer le verset"}
            </AdminButton>
          </div>
        </div>

        {/* Colonne droite : historique */}
        <div className="min-w-0">
          <AdminCard padding="none">
            <div className="p-4 flex flex-col gap-4 border-b border-border">
              <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-brand-primary" />
                  <h2 className="font-semibold text-foreground">Historique des versets</h2>
                </div>
                <div className="flex gap-2">
                  <div className="relative flex-1 sm:flex-initial sm:min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Rechercher (référence, texte...)"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && fetchVerses()}
                      className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-sm"
                    />
                  </div>
                  <AdminButton
                    variant="outline"
                    icon={<RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />}
                    onClick={fetchVerses}
                    disabled={loading}
                  >
                    Rafraîchir
                  </AdminButton>
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {loading ? (
                <div className="px-6 py-12 text-center text-muted-foreground text-sm">Chargement...</div>
              ) : history.length === 0 ? (
                <div className="px-6 py-12 text-center text-muted-foreground text-sm">
                  Aucun verset. Créez un verset pour commencer.
                </div>
              ) : (
                <table className="min-w-full divide-y divide-border">
                  <thead>
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Date</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Image</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Référence</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Texte</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase">Statut</th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry) => (
                      <tr key={entry.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-muted-foreground whitespace-nowrap">{formatVerseDate(entry)}</td>
                        <td className="px-6 py-4">
                          {entry.imageUrl ? (
                            <div className="w-12 h-9 rounded overflow-hidden bg-slate-100">
                              <img src={entry.imageUrl} alt="" className="w-full h-full object-cover" />
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-foreground">{entry.reference}</td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-[220px]">
                          <span className="block truncate" title={entry.text}>{entry.text}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${(entry.is_published ?? false) ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"}`}>
                            {(entry.is_published ?? false) ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            {(entry.is_published ?? false) ? "Publié" : "Brouillon"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openPublishConfirm(entry, !(entry.is_published ?? false))}
                              disabled={publishingId === entry.id}
                              className={`p-2 rounded-lg transition-colors ${(entry.is_published ?? false) ? "text-amber-600 hover:bg-amber-50" : "text-green-600 hover:bg-green-50"}`}
                              title={(entry.is_published ?? false) ? "Dépublier" : "Publier"}
                            >
                              {publishingId === entry.id ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                              ) : (entry.is_published ?? false) ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleEdit(entry)}
                              className="p-2 text-slate-500 hover:text-brand-primary hover:bg-brand-subtle rounded-lg"
                              title="Modifier"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {!loading && history.length > 0 && (
                <div className="px-6 py-4 border-t border-border flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Lignes par page{" "}
                    <select
                      value={perPage}
                      onChange={(e) => setPerPage(Number(e.target.value))}
                      className="mx-1 px-2 py-1 border border-border rounded text-foreground"
                      aria-label="Lignes par page"
                    >
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Page {page} sur {lastPage}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page <= 1}
                        className="p-2 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Page précédente"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setPage((p) => Math.min(lastPage, p + 1))}
                        disabled={page >= lastPage}
                        className="p-2 rounded-lg border border-border hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Page suivante"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </AdminCard>
        </div>
      </div>

      <AlertDialog open={publishOpen} onOpenChange={(open) => { setPublishOpen(open); if (!open) setPublishConfirm(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {publishConfirm?.publish ? "Publier ce verset ?" : "Dépublier ce verset ?"}
            </AlertDialogTitle>
            <p className="text-sm text-muted-foreground">
              {publishConfirm?.publish
                ? `"${publishConfirm.entry.reference}" sera visible sur la page d'accueil.`
                : `"${publishConfirm?.entry.reference}" ne sera plus affiché sur la page d'accueil.`}
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
    </div>
  );
}
