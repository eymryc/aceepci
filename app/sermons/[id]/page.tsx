"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Video, Headphones, FileText, Calendar, Clock, User, ArrowLeft, Share2, Download } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useState } from "react";

export default function Page() {
  const { id } = useParams();
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Sermon data
  const sermonsData: { [key: string]: any } = {
    "1": {
      title: "La puissance de la foi",
      type: "Vidéo",
      speaker: "Pasteur Jean-Marc Kouassi",
      date: "1 Mars 2026",
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVhY2hlciUyMGNodXJjaHxlbnwxfHx8fDE3NzI0ODQyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Une prédication puissante sur la foi qui déplace les montagnes et transforme les impossibilités en réalités.",
      verse: "Hébreux 11:1",
      verseText: "Or la foi est une ferme assurance des choses qu'on espère, une démonstration de celles qu'on ne voit pas."
    },
    "2": {
      title: "Marcher dans l'amour de Christ",
      type: "Audio",
      speaker: "Pasteur Marie Koné",
      date: "28 Février 2026",
      duration: "38 min",
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB3b21hbiUyMHByYXlpbmd8ZW58MXx8fHwxNzMyNDg0MjAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      description: "Méditation sur l'amour inconditionnel de Christ et comment le vivre au quotidien dans nos relations.",
      verse: "Éphésiens 5:2",
      verseText: "Et marchez dans l'amour, à l'exemple de Christ, qui nous a aimés, et qui s'est livré lui-même à Dieu pour nous."
    },
    "3": {
      title: "Le Saint-Esprit notre consolateur",
      type: "Texte",
      speaker: "Révérend Paul Touré",
      date: "25 Février 2026",
      readTime: "15 min",
      description: "Enseignement approfondi sur le rôle du Saint-Esprit dans la vie du croyant et comment cultiver une relation intime avec Lui.",
      verse: "Jean 14:26",
      verseText: "Mais le consolateur, l'Esprit Saint, que le Père enverra en mon nom, vous enseignera toutes choses, et vous rappellera tout ce que je vous ai dit.",
      fullText: `# Le Saint-Esprit notre consolateur

## Introduction

Le Saint-Esprit est la troisième personne de la Trinité, souvent méconnue mais pourtant essentielle dans la vie du chrétien. Jésus l'a appelé "le Consolateur" (Jean 14:26), celui qui viendrait après lui pour guider, enseigner et fortifier ses disciples.

## I. La promesse du Consolateur

Avant de retourner au Père, Jésus a fait une promesse merveilleuse à ses disciples : "Je prierai le Père, et il vous donnera un autre consolateur, afin qu'il demeure éternellement avec vous" (Jean 14:16).

Cette promesse révèle plusieurs vérités importantes :

### 1. Un autre consolateur
Le mot grec "parakletos" signifie "celui qui est appelé aux côtés de". Le Saint-Esprit vient se tenir à nos côtés pour nous aider, nous conseiller et nous encourager.

### 2. Pour l'éternité
Contrairement à Jésus qui devait retourner au Père physiquement, le Saint-Esprit demeure en nous éternellement. C'est une présence permanente et constante.

### 3. L'Esprit de vérité
Jean 14:17 nous dit que le Saint-Esprit est "l'Esprit de vérité". Il nous guide dans toute la vérité et nous révèle les choses à venir.

## II. Les rôles du Saint-Esprit

### A. Il nous enseigne toutes choses
"Mais le consolateur, l'Esprit Saint, que le Père enverra en mon nom, vous enseignera toutes choses, et vous rappellera tout ce que je vous ai dit" (Jean 14:26).

Le Saint-Esprit est notre enseignant divin qui nous aide à comprendre la Parole de Dieu et à l'appliquer dans nos vies.

### B. Il nous convainc de péché
Jean 16:8 nous dit : "Et quand il sera venu, il convaincra le monde en ce qui concerne le péché, la justice, et le jugement."

C'est le Saint-Esprit qui nous montre nos erreurs et nous guide vers la repentance.

### C. Il intercède pour nous
"De même aussi l'Esprit nous aide dans notre faiblesse, car nous ne savons pas ce qu'il nous convient de demander dans nos prières. Mais l'Esprit lui-même intercède par des soupirs inexprimables" (Romains 8:26).

### D. Il nous donne la puissance
"Mais vous recevrez une puissance, le Saint-Esprit survenant sur vous, et vous serez mes témoins..." (Actes 1:8).

## III. Comment cultiver la présence du Saint-Esprit

### 1. Par la prière
La communion avec Dieu par la prière ouvre notre cœur à l'action du Saint-Esprit.

### 2. Par l'obéissance
"Nous sommes témoins de ces choses, de même que le Saint-Esprit, que Dieu a donné à ceux qui lui obéissent" (Actes 5:32).

### 3. Par la méditation de la Parole
Le Saint-Esprit utilise la Parole de Dieu pour nous parler et nous transformer.

### 4. Par l'adoration
Dans l'adoration sincère, nous créons un environnement propice à la manifestation du Saint-Esprit.

## IV. Les fruits de l'Esprit

Quand nous marchons par l'Esprit, notre vie produit des fruits :

"Mais le fruit de l'Esprit, c'est l'amour, la joie, la paix, la patience, la bonté, la bénignité, la fidélité, la douceur, la tempérance" (Galates 5:22-23).

Ces qualités ne sont pas produites par nos efforts personnels, mais par la vie du Saint-Esprit en nous.

## V. Les dons spirituels

Le Saint-Esprit distribue aussi des dons spirituels pour l'édification de l'Église :

- Parole de sagesse
- Parole de connaissance
- Foi
- Dons de guérison
- Opération de miracles
- Prophétie
- Discernement des esprits
- Diversité de langues
- Interprétation des langues

(1 Corinthiens 12:8-10)

## Conclusion

Le Saint-Esprit n'est pas une force impersonnelle, mais une personne divine qui nous aime et désire une relation intime avec nous. Il est notre consolateur dans l'affliction, notre guide dans la confusion, notre force dans la faiblesse.

Ne négligeons pas cette présence merveilleuse en nous. Cultivons chaque jour notre relation avec le Saint-Esprit par la prière, l'obéissance et l'adoration.

Puissions-nous dire comme Paul : "Que la grâce du Seigneur Jésus Christ, l'amour de Dieu, et la communication du Saint-Esprit, soient avec vous tous !" (2 Corinthiens 13:14)

**Amen.**`
    },
    "4": {
      title: "La prière qui change tout",
      type: "Vidéo",
      speaker: "Pasteur David Yao",
      date: "22 Février 2026",
      duration: "52 min",
      image: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmF5ZXIlMjBjaHVyY2h8ZW58MXx8fHwxNzMyNDg0MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Enseignement pratique sur comment développer une vie de prière efficace et puissante.",
      verse: "1 Thessaloniciens 5:17",
      verseText: "Priez sans cesse."
    },
    "5": {
      title: "Vivre dans la sainteté",
      type: "Audio",
      speaker: "Pasteur Esther Bamba",
      date: "18 Février 2026",
      duration: "42 min",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xpbmVzcyUyMGxpZ2h0fGVufDF8fHx8MTczMjQ4NDIwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      description: "Message puissant sur l'appel à la sainteté et comment marcher dans la pureté au quotidien.",
      verse: "1 Pierre 1:15-16",
      verseText: "Mais, puisque celui qui vous a appelés est saint, vous aussi soyez saints dans toute votre conduite."
    }
  };

  const idStr = Array.isArray(id) ? id[0] : id ?? "1";
  const sermon = sermonsData[idStr];

  if (!sermon) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sermon non trouvé</h2>
          <Link href="/sermons" className="text-brand-primary hover:opacity-90">
            Retour aux sermons
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    setShowShareMenu(!showShareMenu);
  };

  return (
    <div className="min-h-screen bg-brand-subtle">
      {/* Back Button */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/sermons"
            className="inline-flex items-center text-brand-primary hover:opacity-90 font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux sermons
          </Link>
        </div>
      </div>

      {/* Content */}
      <article className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-semibold rounded-full">
                {sermon.type === "Vidéo" && <Video className="w-4 h-4" />}
                {sermon.type === "Audio" && <Headphones className="w-4 h-4" />}
                {sermon.type === "Texte" && <FileText className="w-4 h-4" />}
                {sermon.type}
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {sermon.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-6">
              <div className="flex items-center">
                <User className="w-5 h-5 mr-2" />
                <span className="font-semibold">{sermon.speaker}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                {sermon.date}
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                {sermon.duration || sermon.readTime}
              </div>
            </div>

            {/* Verse */}
            <div className="bg-brand-subtle border-l-4 border-brand-primary p-6 rounded-r-lg mb-6">
              <p className="text-sm font-semibold text-brand-primary mb-2">{sermon.verse}</p>
              <p className="text-foreground italic">{sermon.verseText}</p>
            </div>

            {/* Description */}
            <p className="text-xl text-foreground leading-relaxed mb-8">
              {sermon.description}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-white border border-border text-foreground rounded-lg hover:bg-brand-subtle transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  Partager
                </button>
                {showShareMenu && (
                  <div className="absolute top-full mt-2 bg-white rounded-lg shadow-lg border p-4 z-10 w-48">
                    <p className="text-sm text-muted-foreground mb-2">Partager via :</p>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 hover:bg-muted rounded">Facebook</button>
                      <button className="w-full text-left px-3 py-2 hover:bg-muted rounded">WhatsApp</button>
                      <button className="w-full text-left px-3 py-2 hover:bg-muted rounded">Email</button>
                    </div>
                  </div>
                )}
              </div>
              {sermon.type !== "Texte" && (
                <button className="flex items-center gap-2 px-6 py-3 bg-white border border-border text-foreground rounded-lg hover:bg-brand-subtle transition-colors">
                  <Download className="w-5 h-5" />
                  Télécharger
                </button>
              )}
            </div>
          </div>

          {/* Media Content */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            {sermon.type === "Vidéo" && sermon.videoUrl && (
              <div className="relative pb-[56.25%]">
                <iframe
                  src={sermon.videoUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={sermon.title}
                />
              </div>
            )}

            {sermon.type === "Audio" && sermon.audioUrl && (
              <div className="p-8">
                <div className="mb-6">
                  <ImageWithFallback
                    src={sermon.image}
                    alt={sermon.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <audio controls className="w-full">
                  <source src={sermon.audioUrl} type="audio/mpeg" />
                  Votre navigateur ne supporte pas l'élément audio.
                </audio>
              </div>
            )}

            {sermon.type === "Texte" && sermon.fullText && (
              <div className="p-8 md:p-12">
                <div 
                  className="content-prose prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: sermon.fullText.split('\n').map((line: string) => {
                      if (line.startsWith('# ')) return `<h1 class="text-4xl font-bold text-foreground mb-6 mt-8">${line.substring(2)}</h1>`;
                      if (line.startsWith('## ')) return `<h2 class="text-3xl font-bold text-foreground mb-4 mt-6">${line.substring(3)}</h2>`;
                      if (line.startsWith('### ')) return `<h3 class="text-2xl font-bold text-foreground mb-3 mt-4">${line.substring(4)}</h3>`;
                      if (line.startsWith('- ')) return `<li class="text-foreground mb-2">${line.substring(2)}</li>`;
                      if (line.trim() === '') return '<br>';
                      return `<p class="text-foreground mb-4 leading-relaxed">${line}</p>`;
                    }).join('') 
                  }}
                />
              </div>
            )}
          </div>

          {/* Other Sermons */}
          <div className="bg-white rounded-xl p-8 shadow-sm">
            <h3 className="text-2xl font-bold text-foreground mb-6">
              Autres sermons
            </h3>
            <div className="space-y-4">
              {Object.entries(sermonsData).slice(0, 3).map(([sermonId, s]) => {
                if (sermonId === id) return null;
                return (
                  <Link
                    key={sermonId}
                    href={`/sermons/${sermonId}`}
                    className="flex items-center gap-4 p-4 hover:bg-brand-subtle rounded-lg transition-colors group"
                  >
                    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      {s.type !== "Texte" ? (
                        <ImageWithFallback
                          src={s.image}
                          alt={s.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-primary flex items-center justify-center">
                          <FileText className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-brand-primary font-semibold mb-1">{s.type}</p>
                      <h4 className="font-bold text-foreground group-hover:text-brand-primary transition-colors truncate">
                        {s.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">{s.speaker}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Link
              href="/sermons"
              className="block mt-6 pt-6 border-t border-border text-center text-sm font-medium text-brand-primary hover:opacity-90"
            >
              Voir tous les sermons
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
