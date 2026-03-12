"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageIcon, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, AdminCard, AdminPageHeader } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import { presidentMessageApi } from "@/lib/api";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const inputClassName =
  "w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

type PresidentMessageForm = {
  sectionLabel: string;
  title: string;
  greeting: string;
  message: string;
  quote: string;
  badgeText: string;
};

const defaultForm: PresidentMessageForm = {
  sectionLabel: "MESSAGE DU PRÉSIDENT",
  title: "BIENVENUE À L'ACEEPCI",
  greeting: "Chers frères et soeurs, chers amis de l'ACEEPCI,",
  message:
    "C'est avec une grande joie que je vous accueille sur notre plateforme digitale. Depuis plus de 60 ans, l'ACEEPCI s'engage à gagner l'école ivoirienne à Christ et à équiper les jeunes pour un leadership d'excellence, dans une communauté de foi vivante et engagée.",
  quote: "Ma jeunesse pour Jésus-Christ",
  badgeText: "60+ ANS",
};

export default function AdminPresidentMessagePage() {
  const { token } = useAuth();
  const [form, setForm] = useState<PresidentMessageForm>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const setField = <K extends keyof PresidentMessageForm>(field: K, value: PresidentMessageForm[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image valide.");
      e.target.value = "";
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("L'image ne doit pas dépasser 2 Mo.");
      e.target.value = "";
      return;
    }

    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
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

  const fetchPresidentMessage = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await presidentMessageApi.get(token);
      if (res.data) {
        setForm({
          sectionLabel: res.data.section_label ?? defaultForm.sectionLabel,
          title: res.data.title ?? defaultForm.title,
          greeting: res.data.salutation ?? defaultForm.greeting,
          message: res.data.message ?? defaultForm.message,
          quote: res.data.quote ?? defaultForm.quote,
          badgeText: res.data.badge ?? defaultForm.badgeText,
        });
        setImagePreview(res.data.imageUrl ?? null);
      }
    } catch {
      // Laisse le formulaire par défaut si rien n'est encore créé
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPresidentMessage();
  }, [fetchPresidentMessage]);

  const handleSubmit = async (publish = false) => {
    if (!token) {
      setFormError("Vous devez être connecté pour enregistrer ce contenu.");
      toast.error("Vous devez être connecté pour enregistrer ce contenu.");
      return;
    }

    if (!form.title.trim()) {
      setFormError("Le titre est requis.");
      toast.error("Le titre est requis.");
      return;
    }

    if (!form.greeting.trim()) {
      setFormError("La salutation est requise.");
      toast.error("La salutation est requise.");
      return;
    }

    if (!form.message.trim()) {
      setFormError("Le message est requis.");
      toast.error("Le message est requis.");
      return;
    }

    if (!imageFile && !imagePreview) {
      setFormError("L'image du président est requise.");
      toast.error("L'image du président est requise.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const res = await presidentMessageApi.create(
        token,
        {
          sectionLabel: form.sectionLabel,
          badge: form.badgeText,
          title: form.title,
          salutation: form.greeting,
          message: form.message,
          quote: form.quote,
          publish,
        },
        imageFile
      );
      toast.success(
        res.message ||
          (publish
            ? "Message du président enregistré et publié."
            : "Message du président enregistré.")
      );
      setImagePreview(res.data?.imageUrl ?? imagePreview);
      setImageFile(null);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Erreur lors de l'enregistrement du message du président.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Mot du président"
        description="Préparez ici le contenu administrable du bloc Mot du président. Le branchement API pourra être fait ensuite."
      />

      {loading && (
        <div className="max-w-6xl rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm">
          Chargement du message existant...
        </div>
      )}

      <div className="grid max-w-6xl gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <AdminCard>
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Contenu principal</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ces champs alimenteront la partie texte du bloc public.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Libellé de section</label>
                  <input
                    type="text"
                    value={form.sectionLabel}
                    onChange={(e) => setField("sectionLabel", e.target.value)}
                    className={inputClassName}
                    placeholder="MESSAGE DU PRÉSIDENT"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">Badge</label>
                  <input
                    type="text"
                    value={form.badgeText}
                    onChange={(e) => setField("badgeText", e.target.value)}
                    className={inputClassName}
                    placeholder="60+ ANS"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Titre</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  className={inputClassName}
                  placeholder="BIENVENUE À L'ACEEPCI"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Salutation</label>
                <textarea
                  value={form.greeting}
                  onChange={(e) => setField("greeting", e.target.value)}
                  className={`${inputClassName} min-h-[50px] resize-y`}
                  placeholder="Chers frères et soeurs..."
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setField("message", e.target.value)}
                  className={`${inputClassName} min-h-[180px] resize-y`}
                  placeholder="Saisissez ici le message complet du président"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Citation / devise affichée</label>
                <input
                  type="text"
                  value={form.quote}
                  onChange={(e) => setField("quote", e.target.value)}
                  className={inputClassName}
                  placeholder="Ma jeunesse pour Jésus-Christ"
                />
              </div>
            </div>
          </AdminCard>

          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="flex flex-wrap justify-center gap-3">
                <AdminButton onClick={() => handleSubmit(false)} icon={<Save className="w-4 h-4" />} disabled={saving}>
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </AdminButton>
                <AdminButton onClick={() => handleSubmit(true)} icon={<Save className="w-4 h-4" />} disabled={saving}>
                  {saving ? "Publication..." : "Enregistrer et publier"}
                </AdminButton>
              </div>
            </div>

            <AdminCard>
              <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-foreground">Image du président</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Importez ici uniquement l&apos;image qui sera affichée dans le bloc public.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Image du président</label>
                <div className="overflow-hidden rounded-xl border border-dashed border-border bg-slate-50">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Image du président" className="h-72 w-full object-cover" />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute right-3 top-3 rounded-full bg-red-500/90 p-2 text-white hover:bg-red-600"
                        title="Retirer l'image"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 p-6 text-center">
                      <div className="rounded-full bg-white p-4 shadow-sm">
                        <ImageIcon className="h-8 w-8 text-slate-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Importer une image</p>
                        <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, WebP, 2 Mo maximum</p>
                      </div>
                      <span className="inline-flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm text-foreground">
                        <Upload className="h-4 w-4" />
                        Choisir un fichier
                      </span>
                      <input type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {formError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {formError}
                </div>
              )}
              </div>
            </AdminCard>
          </div>
      </div>

      <div className="flex max-w-6xl justify-center">
        <div className="flex flex-wrap justify-center gap-3">
          <AdminButton onClick={() => handleSubmit(false)} icon={<Save className="w-4 h-4" />} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </AdminButton>
          <AdminButton onClick={() => handleSubmit(true)} icon={<Save className="w-4 h-4" />} disabled={saving}>
            {saving ? "Publication..." : "Enregistrer et publier"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
