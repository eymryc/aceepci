"use client";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { heroImages } from "@/config/heroImages";
import { Video, Headphones, FileText, Calendar, Clock, Search, User, ArrowRight, Play } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import { useState, useEffect } from "react";

export default function Page() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Reset to page 1 when search or type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedType]);

  const sermons = [
    {
      id: "1",
      title: "La puissance de la foi",
      type: "Vidéo",
      speaker: "Pasteur Jean-Marc Kouassi",
      date: "1 Mars 2026",
      duration: "45 min",
      image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVhY2hlciUyMGNodXJjaHxlbnwxfHx8fDE3NzI0ODQyMDB8MA&ixlib=rb-4.1.0&q=80&w=1080",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Une prédication puissante sur la foi qui déplace les montagnes et transforme les impossibilités en réalités.",
      verse: "Hébreux 11:1"
    },
    {
      id: "2",
      title: "Marcher dans l'amour de Christ",
      type: "Audio",
      speaker: "Pasteur Marie Koné",
      date: "28 Février 2026",
      duration: "38 min",
      image: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB3b21hbiUyMHByYXlpbmd8ZW58MXx8fHwxNzMyNDg0MjAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      description: "Méditation sur l'amour inconditionnel de Christ et comment le vivre au quotidien dans nos relations.",
      verse: "Éphésiens 5:2"
    },
    {
      id: "3",
      title: "Le Saint-Esprit notre consolateur",
      type: "Texte",
      speaker: "Révérend Paul Touré",
      date: "25 Février 2026",
      readTime: "15 min",
      description: "Enseignement approfondi sur le rôle du Saint-Esprit dans la vie du croyant et comment cultiver une relation intime avec Lui.",
      verse: "Jean 14:26",
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
    {
      id: "4",
      title: "La prière qui change tout",
      type: "Vidéo",
      speaker: "Pasteur David Yao",
      date: "22 Février 2026",
      duration: "52 min",
      image: "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmF5ZXIlMjBjaHVyY2h8ZW58MXx8fHwxNzMyNDg0MjAyfDA&ixlib=rb-4.1.0&q=80&w=1080",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Enseignement pratique sur comment développer une vie de prière efficace et puissante.",
      verse: "1 Thessaloniciens 5:17"
    },
    {
      id: "5",
      title: "Vivre dans la sainteté",
      type: "Audio",
      speaker: "Pasteur Esther Bamba",
      date: "18 Février 2026",
      duration: "42 min",
      image: "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob2xpbmVzcyUyMGxpZ2h0fGVufDF8fHx8MTczMjQ4NDIwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      description: "Message puissant sur l'appel à la sainteté et comment marcher dans la pureté au quotidien.",
      verse: "1 Pierre 1:15-16"
    },
    {
      id: "6",
      title: "Les promesses de Dieu",
      type: "Texte",
      speaker: "Pasteur Samuel Diabaté",
      date: "15 Février 2026",
      readTime: "12 min",
      description: "Étude biblique sur les promesses fidèles de Dieu et comment s'en emparer par la foi.",
      verse: "2 Corinthiens 1:20",
      fullText: `# Les promesses de Dieu

## Introduction

La Bible est remplie de promesses que Dieu nous a faites. Ces promesses sont comme des ancres pour notre âme dans les tempêtes de la vie. 2 Pierre 1:4 nous dit que Dieu "nous a donné les très grandes et précieuses promesses".

## I. Les caractéristiques des promesses de Dieu

### 1. Elles sont certaines
"Car, pour ce qui concerne toutes les promesses de Dieu, c'est en lui qu'est le oui" (2 Corinthiens 1:20). Dieu ne peut pas mentir (Nombres 23:19).

### 2. Elles sont immuables
"Dieu voulant montrer avec plus d'évidence aux héritiers de la promesse l'immutabilité de sa résolution, intervint par un serment" (Hébreux 6:17).

### 3. Elles sont précieuses
Pierre les qualifie de "très grandes et précieuses promesses" (2 Pierre 1:4).

## II. Quelques grandes promesses

### A. La promesse du salut
"Car quiconque invoquera le nom du Seigneur sera sauvé" (Romains 10:13).

### B. La promesse de la présence de Dieu
"Je ne te délaisserai point, et je ne t'abandonnerai point" (Hébreux 13:5).

### C. La promesse de la paix
"Je vous laisse la paix, je vous donne ma paix" (Jean 14:27).

### D. La promesse de la provision
"Et mon Dieu pourvoira à tous vos besoins selon sa richesse, avec gloire, en Jésus Christ" (Philippiens 4:19).

## III. Comment s'emparer des promesses

### 1. Par la foi
Sans la foi, il est impossible de recevoir quoi que ce soit de Dieu (Hébreux 11:6).

### 2. Par la prière
Jacques 4:2 dit : "vous ne possédez pas, parce que vous ne demandez pas."

### 3. Par l'obéissance
Jean 15:7 : "Si vous demeurez en moi, et que mes paroles demeurent en vous, demandez ce que vous voudrez, et cela vous sera accordé."

## Conclusion

Les promesses de Dieu sont notre héritage. Elles sont oui et amen en Christ. Apprenons à les connaître, à les méditer et à nous en emparer par la foi.

**Amen.**`
    },
    {
      id: "7",
      title: "L'espérance du retour de Christ",
      type: "Vidéo",
      speaker: "Pasteur André Konan",
      date: "11 Février 2026",
      duration: "48 min",
      image: "https://images.unsplash.com/photo-1501466044931-62695aada8e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxza3klMjBob3BlJTIwY2xvdWRzfGVufDF8fHx8MTczMjQ4NDIwNHww&ixlib=rb-4.1.0&q=80&w=1080",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Message prophétique sur le retour imminent de Jésus-Christ et comment nous y préparer.",
      verse: "1 Thessaloniciens 4:16-17"
    },
    {
      id: "8",
      title: "Le pardon libérateur",
      type: "Audio",
      speaker: "Pasteur Grace Ouattara",
      date: "8 Février 2026",
      duration: "35 min",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb3JnaXZlbmVzcyUyMGZyZWVkb218ZW58MXx8fHwxNzMyNDg0MjA1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      description: "Enseignement sur le pouvoir libérateur du pardon et comment se libérer de l'amertume.",
      verse: "Matthieu 6:14-15"
    },
    {
      id: "9",
      title: "Servir avec excellence",
      type: "Texte",
      speaker: "Pasteur Michel Traoré",
      date: "4 Février 2026",
      readTime: "10 min",
      description: "Réflexion sur l'importance de servir Dieu et les autres avec excellence et dévouement.",
      verse: "Colossiens 3:23-24",
      fullText: `# Servir avec excellence

## Introduction

"Tout ce que vous faites, faites-le de bon cœur, comme pour le Seigneur et non pour des hommes" (Colossiens 3:23).

Le service est au cœur de la vie chrétienne. Jésus lui-même est venu non pour être servi, mais pour servir (Marc 10:45).

## I. Le modèle de Jésus

Jésus nous a laissé l'exemple parfait du service :
- Il a lavé les pieds de ses disciples (Jean 13)
- Il a guéri les malades
- Il a nourri les foules
- Il a donné sa vie pour nous

## II. L'excellence dans le service

### 1. Servir de tout notre cœur
Pas par obligation, mais par amour pour Dieu et pour les autres.

### 2. Servir avec nos dons
Dieu nous a donné des dons pour édifier le corps de Christ (1 Pierre 4:10).

### 3. Servir avec fidélité
"Ce qu'on demande des dispensateurs, c'est que chacun soit trouvé fidèle" (1 Corinthiens 4:2).

## III. La récompense du service

"Sachant que vous recevrez du Seigneur l'héritage pour récompense. Vous servez Christ, le Seigneur" (Colossiens 3:24).

## Conclusion

Que notre service soit toujours offert avec excellence, sachant que c'est le Seigneur que nous servons.

**Amen.**`
    },
    {
      id: "10",
      title: "La joie du Seigneur",
      type: "Vidéo",
      speaker: "Pasteur Joël Kouadio",
      date: "1 Février 2026",
      duration: "40 min",
      image: "https://images.unsplash.com/photo-1502301103665-0b95cc738daf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqb3klMjBoYXBwaW5lc3N8ZW58MXx8fHwxNzMyNDg0MjA2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      description: "Message encourageant sur comment cultiver la joie du Seigneur même dans les épreuves.",
      verse: "Néhémie 8:10"
    },
    {
      id: "11",
      title: "La sagesse d'en haut",
      type: "Audio",
      speaker: "Pasteur Élisabeth N'Guessan",
      date: "28 Janvier 2026",
      duration: "44 min",
      image: "https://images.unsplash.com/photo-1516534775068-ba3e7458af70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXNkb20lMjBib29rfGVufDF8fHx8MTczMjQ4NDIwN3ww&ixlib=rb-4.1.0&q=80&w=1080",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      description: "Enseignement pratique sur comment demander et recevoir la sagesse de Dieu.",
      verse: "Jacques 1:5"
    },
    {
      id: "12",
      title: "Vaincre la tentation",
      type: "Texte",
      speaker: "Pasteur Emmanuel Soro",
      date: "25 Janvier 2026",
      readTime: "14 min",
      description: "Guide pratique pour résister à la tentation et vivre dans la victoire.",
      verse: "1 Corinthiens 10:13",
      fullText: `# Vaincre la tentation

## Introduction

La tentation fait partie de l'expérience humaine. Même Jésus a été tenté (Hébreux 4:15). Mais Dieu nous donne les moyens de la vaincre.

## I. Comprendre la tentation

### 1. D'où vient-elle ?
Jacques 1:14 dit : "chacun est tenté quand il est attiré et amorcé par sa propre convoitise."

### 2. Le but de l'ennemi
Satan veut nous faire chuter et nous éloigner de Dieu.

## II. Les armes pour vaincre

### 1. La Parole de Dieu
Jésus a vaincu Satan en citant les Écritures (Matthieu 4).

### 2. La prière
"Veillez et priez, afin que vous ne tombiez pas dans la tentation" (Matthieu 26:41).

### 3. La fuite
"Fuyez l'impudicité" (1 Corinthiens 6:18). Parfois, la meilleure stratégie est de fuir.

### 4. Le Saint-Esprit
Galates 5:16 : "Marchez selon l'Esprit, et vous n'accomplirez pas les désirs de la chair."

## III. La promesse de Dieu

"Aucune tentation ne vous est survenue qui n'ait été humaine, et Dieu, qui est fidèle, ne permettra pas que vous soyez tentés au delà de vos forces; mais avec la tentation il préparera aussi le moyen d'en sortir, afin que vous puissiez la supporter" (1 Corinthiens 10:13).

## Conclusion

Dieu nous donne toujours une issue. Comptons sur Sa force et non sur la nôtre.

**Amen.**`
    }
  ];

  const types = ["all", "Vidéo", "Audio", "Texte"];

  const filteredSermons = sermons.filter(sermon => {
    const matchesSearch = sermon.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         sermon.speaker.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sermon.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || sermon.type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredSermons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSermons = filteredSermons.slice(startIndex, endIndex);

  const getIcon = (type: string) => {
    switch (type) {
      case "Vidéo":
        return <Video className="w-5 h-5" />;
      case "Audio":
        return <Headphones className="w-5 h-5" />;
      case "Texte":
        return <FileText className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const featuredSermon = filteredSermons[0];
  const gridSermons = currentPage === 1 && featuredSermon ? currentSermons.slice(1) : currentSermons;

  return (
    <div>
      <PageHero
        title="Prédications & Messages"
        subtitle="Écoutez, regardez ou lisez les enseignements bibliques de nos pasteurs"
        background={heroImages.sermons}
      />

      {/* Featured sermon (section claire) */}
      {featuredSermon && currentPage === 1 && (
        <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
          <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="relative z-10 max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">À la une</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <Link href={`/sermons/${featuredSermon.id}`} className="block group">
              <div className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-2xl border border-border overflow-hidden shadow-[0_20px_60px_rgba(24,64,112,0.08)] hover:shadow-[0_24px_80px_rgba(24,64,112,0.12)] hover:border-brand-primary/20 transition-all duration-300">
                <div className="relative aspect-video md:aspect-[4/3] overflow-hidden">
                  {featuredSermon.type !== "Texte" ? (
                    <>
                      <ImageWithFallback
                        src={featuredSermon.image}
                        alt={featuredSermon.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                          {featuredSermon.type === "Vidéo" ? (
                            <Play className="w-10 h-10 text-brand-primary ml-1" fill="currentColor" />
                          ) : (
                            <Headphones className="w-10 h-10 text-brand-primary" />
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center">
                      <FileText className="w-24 h-24 text-white" />
                    </div>
                  )}
                  <span className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 backdrop-blur-sm text-foreground text-[0.65rem] font-semibold tracking-[0.1em] uppercase rounded-lg flex items-center gap-1.5">
                    {getIcon(featuredSermon.type)}
                    {featuredSermon.type}
                  </span>
                </div>
                <div className="p-8 md:p-10">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1.5">
                      <User className="w-4 h-4 text-brand-primary" />
                      {featuredSermon.speaker}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                      {featuredSermon.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-brand-primary" />
                      {"duration" in featuredSermon ? featuredSermon.duration : featuredSermon.readTime}
                    </span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight group-hover:text-brand-primary transition-colors">
                    {featuredSermon.title}
                  </h2>
                  <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                    {featuredSermon.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold tracking-[0.12em] uppercase text-brand-primary">
                      {featuredSermon.verse}
                    </span>
                    <span className="inline-flex items-center gap-2 text-brand-primary font-semibold text-sm group-hover:gap-3 transition-all">
                      {featuredSermon.type === "Audio" ? "Écouter" : featuredSermon.type === "Vidéo" ? "Regarder" : "Lire"}
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </AnimateSection>
      )}

      {/* Grille des sermons (section sombre) */}
      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        <div className="pointer-events-none absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.18)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header + Search + Filtres */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1 h-1 rounded-full bg-brand-light" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">Enseignements</p>
                <span className="w-1 h-1 rounded-full bg-brand-light" />
              </div>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">
                Toutes les <em className="not-italic italic text-brand-light">prédications</em>
              </h2>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 flex-1 lg:max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedType === type
                        ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-[0_4px_12px_rgba(24,64,112,0.3)]"
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-brand-primary/30"
                    }`}
                  >
                    {type !== "all" && getIcon(type)}
                    {type === "all" ? "Tous" : type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredSermons.length > 0 ? (
            <>
              <p className="text-sm text-white mb-8">
                {filteredSermons.length} sermon{filteredSermons.length > 1 ? "s" : ""} trouvé{filteredSermons.length > 1 ? "s" : ""}
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridSermons.map((sermon) => (
                  <Link
                    key={sermon.id}
                    href={`/sermons/${sermon.id}`}
                    className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-brand-primary/30 hover:bg-white/8 transition-all duration-300"
                  >
                    <div className="relative h-40 overflow-hidden">
                      {sermon.type !== "Texte" ? (
                        <>
                          <ImageWithFallback
                            src={sermon.image}
                            alt={sermon.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-dark/70 to-transparent" />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center">
                              {sermon.type === "Vidéo" ? (
                                <Play className="w-6 h-6 text-brand-primary ml-1" fill="currentColor" />
                              ) : (
                                <Headphones className="w-6 h-6 text-brand-primary" />
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-brand-primary to-brand-primary-dark flex items-center justify-center">
                          <FileText className="w-14 h-14 text-white" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-foreground text-[0.6rem] font-semibold tracking-[0.08em] uppercase rounded-md flex items-center gap-1">
                        {getIcon(sermon.type)}
                        {sermon.type}
                      </span>
                    </div>
                    <div className="p-5">
                      <h3 className="font-serif text-lg font-bold text-white mb-2 line-clamp-2 leading-snug group-hover:text-brand-light transition-colors">
                        {sermon.title}
                      </h3>
                      <p className="text-xs text-white mb-3 flex items-center gap-1 truncate">
                        <User className="w-3 h-3 flex-shrink-0" />
                        {sermon.speaker}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {sermon.date}
                        </span>
                        <span className="font-semibold text-brand-light">{sermon.verse}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {filteredSermons.length > itemsPerPage && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 hover:border-brand-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Précédent
                  </button>
                  <span className="text-sm text-white">
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-5 py-2.5 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 hover:border-brand-primary/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                <Video className="w-10 h-10 text-white" />
              </div>
              <h3 className="font-serif text-xl font-bold text-white mb-2">Aucun sermon trouvé</h3>
              <p className="text-white max-w-md mx-auto">
                Essayez de modifier votre recherche ou vos filtres.
              </p>
            </div>
          )}
        </div>
      </AnimateSection>
    </div>
  );
}
