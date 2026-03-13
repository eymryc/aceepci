"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Save, Plus, Trash2, FileText, Upload, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { AdminButton, AdminCard, AdminPageHeader } from "@/components/admin";
import { useAuth } from "@/contexts/AuthContext";
import { documentsSectionApi } from "@/lib/api";

const inputClass = "w-full rounded-lg border border-border px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20";

interface DocForm {
  id?: number;
  title: string;
  description: string;
  file_url?: string | null;
  newFile?: File | null;
}

const defaultDocs: DocForm[] = [
  { title: "Statuts de l'ACEEPCI", description: "PDF – Mise à jour 2025", file_url: null, newFile: null },
  { title: "Règlement intérieur", description: "PDF – Mise à jour 2025", file_url: null, newFile: null },
];

export default function AdminDocumentsPage() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    sectionLabel: "ACEEPCI · Ressources",
    title: "DOCUMENTS OFFICIELS",
    subtitle: "Téléchargez nos statuts et règlement intérieur",
    docs: defaultDocs,
  });
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const fileRefs = useRef<(HTMLInputElement | null)[]>([]);

  const fetchData = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await documentsSectionApi.get(token);
      if (res.data) {
        const docs: DocForm[] =
          res.data.documents && res.data.documents.length > 0
            ? res.data.documents.map((d) => ({
                id: d.id,
                title: d.title,
                description: d.description,
                file_url: d.file_url || null,
                newFile: null,
              }))
            : defaultDocs;
        setForm({
          sectionLabel: res.data.section_label || "ACEEPCI · Ressources",
          title: res.data.title || "DOCUMENTS OFFICIELS",
          subtitle: res.data.subtitle || "Téléchargez nos statuts et règlement intérieur",
          docs,
        });
      }
    } catch {
      // Valeurs par défaut
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (publish = false) => {
    if (!token) {
      toast.error("Vous devez être connecté.");
      return;
    }
    if (!form.title.trim()) {
      toast.error("Le titre est requis.");
      return;
    }
    if (form.docs.some((d) => !d.title.trim())) {
      toast.error("Chaque document doit avoir un titre.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const files = form.docs.map((d) => d.newFile || null);
      await documentsSectionApi.save(
        token,
        {
          section_label: form.sectionLabel,
          title: form.title,
          subtitle: form.subtitle,
          documents: form.docs.map((d) => ({ title: d.title, description: d.description })),
          publish,
        },
        files
      );
      toast.success(publish ? "Documents publiés." : "Documents enregistrés.");
      await fetchData();
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : "Erreur.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const updateDoc = (index: number, field: keyof DocForm, value: string) => {
    const next = [...form.docs];
    next[index] = { ...next[index], [field]: value };
    setForm({ ...form, docs: next });
  };

  const handleFileChange = (index: number, file: File | null) => {
    const next = [...form.docs];
    next[index] = { ...next[index], newFile: file };
    setForm({ ...form, docs: next });
  };

  const addDoc = () => {
    setForm({ ...form, docs: [...form.docs, { title: "", description: "", file_url: null, newFile: null }] });
  };

  const removeDoc = (index: number) => {
    if (form.docs.length <= 1) {
      toast.error("Il faut au moins un document.");
      return;
    }
    const next = form.docs.filter((_, i) => i !== index);
    setForm({ ...form, docs: next });
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Documents officiels" description="Gérez les documents téléchargeables (statuts, règlement, etc.)." />
      {loading && <div className="rounded-xl border bg-white px-4 py-3 text-sm">Chargement...</div>}

      <div className="grid max-w-6xl gap-6">
        <AdminCard>
          <div className="space-y-4">
            <h2 className="font-semibold">En-tête de section</h2>
            <div>
              <label htmlFor="sectionLabel" className="block text-sm font-medium mb-2">Libellé</label>
              <input id="sectionLabel" type="text" value={form.sectionLabel} onChange={(e) => setForm({ ...form, sectionLabel: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">Titre *</label>
              <input id="title" type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium mb-2">Sous-titre</label>
              <input id="subtitle" type="text" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputClass} />
            </div>
          </div>
        </AdminCard>

        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Documents ({form.docs.length})</h2>
          <button
            type="button"
            onClick={addDoc}
            className="flex items-center gap-2 rounded-lg border border-brand-primary/30 bg-brand-primary/5 px-3 py-2 text-sm font-medium text-brand-primary hover:bg-brand-primary/10 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Ajouter un document
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {form.docs.map((doc, i) => (
            <AdminCard key={i}>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-brand-primary" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Document {i + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDoc(i)}
                    className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                    title={`Supprimer le document ${i + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label htmlFor={`doc-title-${i}`} className="block text-sm mb-1">Titre *</label>
                  <input
                    id={`doc-title-${i}`}
                    type="text"
                    value={doc.title}
                    onChange={(e) => updateDoc(i, "title", e.target.value)}
                    className={inputClass}
                    placeholder="Statuts de l'ACEEPCI"
                  />
                </div>

                <div>
                  <label htmlFor={`doc-desc-${i}`} className="block text-sm mb-1">Description</label>
                  <input
                    id={`doc-desc-${i}`}
                    type="text"
                    value={doc.description}
                    onChange={(e) => updateDoc(i, "description", e.target.value)}
                    className={inputClass}
                    placeholder="PDF – Mise à jour 2025"
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Fichier PDF</label>
                  <input
                    ref={(el) => { fileRefs.current[i] = el; }}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    title={`Fichier du document ${i + 1}`}
                    aria-label={`Fichier du document ${i + 1}`}
                    onChange={(e) => handleFileChange(i, e.target.files?.[0] || null)}
                  />
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileRefs.current[i]?.click()}
                      className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-slate-50 transition-colors"
                    >
                      <Upload className="w-4 h-4 text-muted-foreground" />
                      {doc.newFile ? doc.newFile.name : "Choisir un fichier"}
                    </button>
                    {doc.file_url && !doc.newFile && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-sm text-brand-primary hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        Voir le fichier actuel
                      </a>
                    )}
                    {doc.newFile && (
                      <span className="text-xs text-green-600 font-medium">Nouveau fichier sélectionné</span>
                    )}
                  </div>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>

        {error && <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

        <div className="flex gap-3 justify-center">
          <AdminButton onClick={() => handleSubmit(false)} icon={<Save className="w-4 h-4" />} disabled={saving}>
            {saving ? "Enregistrement..." : "Enregistrer"}
          </AdminButton>
          <AdminButton onClick={() => handleSubmit(true)} icon={<Save className="w-4 h-4" />} disabled={saving}>
            {saving ? "Publication..." : "Publier"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
