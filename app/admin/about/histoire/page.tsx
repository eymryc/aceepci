"use client";

import { useCallback, useEffect, useState } from "react";
import { ImageIcon, Save, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, AdminCard, AdminPageHeader } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import { historySectionApi } from "@/lib/api";

const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const inputClassName =
  "w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

type HistoryForm = {
  sectionLabel: string;
  title: string;
  message: string;
};

const defaultForm: HistoryForm = {
  sectionLabel: "ACEEPCI • HISTOIRE",
  title: "DEPUIS 1961",
  message:
    "L'Association Chrétienne des Elèves et Etudiants Protestants de Côte d'Ivoire (ACEEPCI) a été fondée le 1er novembre 1961, avec pour mission de rassembler les jeunes chrétiens protestants des établissements scolaires et universitaires.\n\nNée dans un contexte post-indépendance, l'ACEEPCI s'impose comme un acteur majeur de l'évangélisation en milieu scolaire et estudiantin, tout en formant des leaders spirituels et intellectuels.\n\nAujourd'hui, avec plus de 5 000 membres actifs répartis dans 88 départements à travers la Côte d'Ivoire, l'ACEEPCI continue de transformer des vies par l'Évangile.",
};

export default function AdminHistoryPage() {
  const { token } = useAuth();
  const [form, setForm] = useState<HistoryForm>(defaultForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const setField = <K extends keyof HistoryForm>(field: K, value: HistoryForm[K]) => {
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
    setRemoveImage(false);
    setFormError(null);
    e.target.value = "";
  };

  const clearImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const fetchHistorySection = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await historySectionApi.get(token);
      if (res.data) {
        setForm({
          sectionLabel: res.data.section_label ?? defaultForm.sectionLabel,
          title: res.data.title ?? defaultForm.title,
          message: res.data.content ?? defaultForm.message,
        });
        setImagePreview(res.data.imageUrl ?? null);
        setRemoveImage(false);
      }
    } catch {
      // Laisse les valeurs par défaut si aucun contenu n'existe encore
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistorySection();
  }, [fetchHistorySection]);

  const handleSubmit = async (publish = false) => {
    if (!token) {
      setFormError("Vous devez être connecté pour enregistrer ce contenu.");
      toast.error("Vous devez être connecté pour enregistrer ce contenu.");
      return;
    }

    if (!form.sectionLabel.trim()) {
      setFormError("Le libellé de section est requis.");
      toast.error("Le libellé de section est requis.");
      return;
    }

    if (!form.title.trim()) {
      setFormError("Le titre est requis.");
      toast.error("Le titre est requis.");
      return;
    }

    if (!form.message.trim()) {
      setFormError("Le contenu historique est requis.");
      toast.error("Le contenu historique est requis.");
      return;
    }

    setSaving(true);
    setFormError(null);

    try {
      const res = await historySectionApi.create(
        token,
        {
          sectionLabel: form.sectionLabel,
          title: form.title,
          content: form.message,
          removeImage,
          publish,
        },
        imageFile
      );
      toast.success(
        res.message ||
          (publish
            ? "Section Histoire enregistrée et publiée."
            : "Section Histoire enregistrée.")
      );
      setImagePreview(res.data?.imageUrl ?? (removeImage ? null : imagePreview));
      setImageFile(null);
      setRemoveImage(false);
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? String((err as { message: string }).message)
          : "Erreur lors de l'enregistrement de la section Histoire.";
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Histoire"
        description="Préparez ici le contenu administrable de la section Histoire. Le branchement API pourra être fait ensuite."
      />

      {loading && (
        <div className="max-w-6xl rounded-xl border border-border bg-white px-4 py-3 text-sm text-muted-foreground shadow-sm">
          Chargement de l&apos;historique existant...
        </div>
      )}

      <div className="grid max-w-6xl gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <AdminCard>
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-semibold text-foreground">Contenu principal</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ces champs alimenteront la partie texte du bloc Histoire.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Libellé de section</label>
              <input
                type="text"
                value={form.sectionLabel}
                onChange={(e) => setField("sectionLabel", e.target.value)}
                className={inputClassName}
                placeholder="ACEEPCI • HISTOIRE"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Titre</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setField("title", e.target.value)}
                className={inputClassName}
                placeholder="DEPUIS 1961"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">Contenu</label>
              <textarea
                value={form.message}
                onChange={(e) => setField("message", e.target.value)}
                className={`${inputClassName} min-h-[280px] resize-y`}
                placeholder="Saisissez ici tout le texte de la section Histoire"
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
                <h2 className="text-base font-semibold text-foreground">Image de la section</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Importez ici l&apos;image affichée dans le bloc Histoire.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">Image</label>
                <div className="overflow-hidden rounded-xl border border-dashed border-border bg-slate-50">
                  {imagePreview ? (
                    <div className="relative">
                      <img src={imagePreview} alt="Image de la section Histoire" className="h-72 w-full object-cover" />
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
