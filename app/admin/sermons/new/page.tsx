"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Video, Headphones, FileText, Calendar, Clock, User, Link2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { AdminPageHeader, AdminCard, AdminButton } from "@/components/admin";
import { DatePicker } from "@/components/ui/date-picker";
import { sermonsApi, formatApiErrorMessage } from "@/lib/api";

type SermonType = "video" | "audio" | "text";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminSermonsNewPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [type, setType] = useState<SermonType>("video");
  const [title, setTitle] = useState("");
  const [speaker, setSpeaker] = useState("");
  const [date, setDate] = useState("");
  const [duration, setDuration] = useState("35 min");
  const [verseReference, setVerseReference] = useState("");
  const [verseText, setVerseText] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [textContent, setTextContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !speaker.trim() || !verseReference.trim()) {
      toast.error("Titre, prédicateur et référence biblique sont requis.");
      return;
    }

    if (type === "video" && !videoUrl.trim()) {
      toast.error("L’URL de la vidéo est requise pour un sermon vidéo.");
      return;
    }
    if (type === "audio" && !audioUrl.trim()) {
      toast.error("L’URL audio est requise pour un sermon audio.");
      return;
    }
    if (type === "text" && !textContent.trim()) {
      toast.error("Le contenu du sermon est requis pour un sermon texte.");
      return;
    }

    if (!token) {
      toast.error("Authentification requise.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slugify(title),
        type,
        speaker: speaker.trim() || undefined,
        scripture_reference: verseReference.trim() || undefined,
        verse_text: verseText.trim() || undefined,
        excerpt: description.trim() || undefined,
        content: type === "text" ? textContent.trim() : (description.trim() || undefined),
        reading_time: duration.trim() || undefined,
        video_url: type === "video" ? videoUrl.trim() : undefined,
        audio_url: type === "audio" ? audioUrl.trim() : undefined,
        published_at: date || undefined,
        is_published: false,
        comments_enabled: true,
        reactions_enabled: true,
      };
      await sermonsApi.create(token, payload, { imageFile: imageFile ?? undefined });
      toast.success("Sermon créé.");
      router.push("/admin/sermons");
    } catch (err: unknown) {
      toast.error(formatApiErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <Link
          href="/admin/sermons"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux sermons
        </Link>
      </div>

      <AdminPageHeader
        title="Nouveau sermon"
        description="Ajoutez une prédication (vidéo, audio ou texte)"
      />

      <form onSubmit={handleSubmit} className="space-y-6 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.6fr)_minmax(360px,1fr)] gap-6 xl:gap-8 items-start w-full">
          <div className="space-y-6 min-w-0">
            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">Informations principales</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    Titre, prédicateur, date, durée et référence biblique
                  </p>
                </div>
                <div className="inline-flex items-center rounded-full bg-brand-subtle p-1 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setType("video")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                      type === "video"
                        ? "bg-brand-primary text-white"
                        : "text-foreground hover:bg-white"
                    }`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    Vidéo
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("audio")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                      type === "audio"
                        ? "bg-brand-primary text-white"
                        : "text-foreground hover:bg-white"
                    }`}
                  >
                    <Headphones className="w-3.5 h-3.5" />
                    Audio
                  </button>
                  <button
                    type="button"
                    onClick={() => setType("text")}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors ${
                      type === "text"
                        ? "bg-brand-primary text-white"
                        : "text-foreground hover:bg-white"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Texte
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2" htmlFor="sermon-title">
                      Titre du sermon *
                    </label>
                    <input
                      id="sermon-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Marcher dans l’amour de Christ"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2" htmlFor="sermon-speaker">
                      Prédicateur *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="sermon-speaker"
                        type="text"
                        value={speaker}
                        onChange={(e) => setSpeaker(e.target.value)}
                        placeholder="Ex: Pasteur Jean-Marc"
                        className="w-full pl-9 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Date de la prédication
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <DatePicker
                        value={date}
                        onChange={(v) => setDate(v)}
                        placeholder="JJ / MM / AAAA"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2" htmlFor="sermon-duration">
                      Durée
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        id="sermon-duration"
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        placeholder="Ex: 45 min"
                        className="w-full pl-9 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2" htmlFor="sermon-verse">
                      Référence biblique *
                    </label>
                    <input
                      id="sermon-verse"
                      type="text"
                      value={verseReference}
                      onChange={(e) => setVerseReference(e.target.value)}
                      placeholder="Ex: Hébreux 11:1"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="sermon-verse-text">
                    Texte du verset (optionnel)
                  </label>
                  <textarea
                    id="sermon-verse-text"
                    rows={3}
                    value={verseText}
                    onChange={(e) => setVerseText(e.target.value)}
                    placeholder="Texte complet du verset pour l’affichage sur la page du sermon..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2" htmlFor="sermon-description">
                    Résumé / introduction
                  </label>
                  <textarea
                    id="sermon-description"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Courte description du message qui apparaîtra dans les listes..."
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                  />
                </div>
              </div>
            </AdminCard>

            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">
                  Contenu du sermon ({type === "video" ? "Vidéo" : type === "audio" ? "Audio" : "Texte"})
                </h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Définissez la source média ou le texte complet selon le type sélectionné
                </p>
              </div>
              <div className="p-6 space-y-4">
                {type === "video" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2" htmlFor="sermon-video-url">
                        URL de la vidéo (YouTube, Vimeo… ) *
                      </label>
                      <div className="relative">
                        <Link2 className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="sermon-video-url"
                          type="url"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="https://www.youtube.com/embed/..."
                          className="w-full pl-9 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Utilisez de préférence l’URL d’intégration (embed) pour un affichage optimal.
                    </p>
                  </>
                )}

                {type === "audio" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2" htmlFor="sermon-audio-url">
                        URL du fichier audio (MP3, streaming…) *
                      </label>
                      <div className="relative">
                        <Link2 className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          id="sermon-audio-url"
                          type="url"
                          value={audioUrl}
                          onChange={(e) => setAudioUrl(e.target.value)}
                          placeholder="https://.../mon-sermon.mp3"
                          className="w-full pl-9 pr-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Vous pourrez plus tard brancher cette URL sur votre stockage (S3, serveur audio, etc.).
                    </p>
                  </>
                )}

                {type === "text" && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2" htmlFor="sermon-text">
                      Contenu du sermon (texte complet) *
                    </label>
                    <textarea
                      id="sermon-text"
                      rows={14}
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      placeholder={"Vous pouvez utiliser une syntaxe type Markdown (titres, paragraphes, listes...)"}
                      className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary font-mono text-sm"
                    />
                  </div>
                )}
              </div>
            </AdminCard>

            <div className="flex flex-wrap items-center gap-4">
              <AdminButton type="submit" icon={<Save className="w-4 h-4" />} disabled={submitting}>
                {submitting ? "Enregistrement..." : "Enregistrer le sermon"}
              </AdminButton>
              <AdminButton href="/admin/sermons" variant="outline">
                Annuler
              </AdminButton>
            </div>
          </div>

          <div className="space-y-6 min-w-0">
            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Vignettes et illustration</h2>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Image utilisée dans les listes et sur la page du sermon
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-brand-primary/30 transition-colors">
                  <Upload className="w-8 h-8 mx-auto text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground mb-1">
                    Glissez une image ici ou cliquez pour parcourir
                  </p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Format recommandé 16:9, PNG, JPG ou WebP. Max 2 Mo.
                  </p>
                  <input
                    id="sermon-image"
                    type="file"
                    accept="image/*"
                    className="text-xs"
                    onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                  />
                  {imageFile && (
                    <p className="mt-2 text-xs text-muted-foreground truncate">{imageFile.name}</p>
                  )}
                </div>
              </div>
            </AdminCard>

            <AdminCard padding="none">
              <div className="px-6 py-4 border-b border-border">
                <h2 className="font-semibold text-foreground">Conseils de publication</h2>
              </div>
              <div className="p-6 space-y-3 text-sm text-muted-foreground">
                <p>
                  • Utilisez un titre clair et parlant (ex. : <span className="font-medium">&quot;La puissance de la foi&quot;</span>).
                </p>
                <p>
                  • Remplissez toujours la référence biblique et, si possible, le texte du verset pour enrichir la page.
                </p>
                <p>
                  • Les sermons utilisent le même modèle de données que les dévotionnels (titre, slug, référence
                  biblique, extrait, contenu, image, publication) avec en plus le type (vidéo/audio/texte), le
                  prédicateur et les URL média.
                </p>
              </div>
            </AdminCard>
          </div>
        </div>
      </form>
    </div>
  );
}

