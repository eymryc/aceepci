"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  ChevronRight,
  ChevronLeft, 
  ThumbsUp, 
  Heart, 
  Bookmark,
  Share2,
  Facebook,
  Twitter,
  MessageCircle,
  Send,
  BookOpen,
  Lightbulb,
  Check,
  ArrowRight,
  ArrowLeft
} from "lucide-react";

interface Comment {
  id: number;
  author: string;
  date: string;
  content: string;
  avatar: string;
}

interface Reaction {
  id: string;
  icon: typeof Heart;
  label: string;
  count: number;
  active: boolean;
}

export default function Page() {
  const { id } = useParams();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const [reactions, setReactions] = useState<Reaction[]>([
    { id: "amen", icon: ThumbsUp, label: "Amen", count: 89, active: false },
    { id: "blessed", icon: Heart, label: "Béni", count: 56, active: false },
    { id: "insightful", icon: Lightbulb, label: "Édifiant", count: 34, active: false },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Sarah Koné",
      date: "2 Mars 2026",
      content: "Merci pour cette méditation puissante ! Cela m'a vraiment encouragée ce matin. La fidélité de Dieu est réellement notre ancre dans les tempêtes.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
    },
    {
      id: 2,
      author: "David Kouassi",
      date: "2 Mars 2026",
      content: "Amen ! Ce message tombe à point nommé. Je traversais une période difficile et ce rappel de la fidélité de Dieu me réconforte énormément.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    {
      id: 3,
      author: "Aïcha Traoré",
      date: "2 Mars 2026",
      content: "Les questions de réflexion sont excellentes. Elles m'ont vraiment fait réfléchir sur ma relation avec Dieu et sa présence constante dans ma vie.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
  ]);

  const [commentText, setCommentText] = useState("");

  // Données de la dévotion (normalement récupérées via l'API avec l'ID)
  const devotion = {
    id: 1,
    date: "2 Mars 2026",
    title: "La fidélité de Dieu ne faillit jamais",
    verse: {
      reference: "Lamentations 3:22-23",
      text: "Les bontés de l'Éternel ne sont pas épuisées, ses compassions ne sont pas à leur terme; elles se renouvellent chaque matin. Oh! que ta fidélité est grande!"
    },
    image: "https://images.unsplash.com/photo-1642171901844-3fd145fe8d91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiaWJsZSUyMHJlYWRpbmclMjBtb3JuaW5nJTIwbGlnaHR8ZW58MXx8fHwxNzcyNTgzMTA0fDA&ixlib=rb-4.1.0&q=80&w=1080",
    readTime: "5 min",
    content: [
      {
        type: "paragraph",
        text: "Chaque nouveau jour est un témoignage vivant de la fidélité de Dieu. Lorsque nous ouvrons les yeux chaque matin, avant même de prendre conscience de notre environnement, la grâce de Dieu nous a déjà précédés. C'est une vérité que le prophète Jérémie nous rappelle avec force dans le livre des Lamentations.",
      },
      {
        type: "paragraph",
        text: "Le contexte de ce passage est particulièrement significatif. Jérémie écrivait au milieu de la destruction de Jérusalem, entouré de ruines et de désespoir. Pourtant, c'est dans ce moment le plus sombre qu'il proclame avec assurance la fidélité inébranlable de Dieu. Si Dieu était fidèle au milieu du jugement, combien plus l'est-Il dans notre marche quotidienne avec Lui ?",
      },
      {
        type: "heading",
        text: "Une fidélité qui se renouvelle",
      },
      {
        type: "paragraph",
        text: "L'expression 'elles se renouvellent chaque matin' est d'une beauté remarquable. Dieu ne nous donne pas une provision de grâce pour toute une vie d'un seul coup. Il nous la donne quotidiennement, fraîche et nouvelle. Pourquoi ? Parce qu'Il veut que nous restions en communion constante avec Lui, que nous dépendions de Lui chaque jour.",
      },
      {
        type: "paragraph",
        text: "Pensez à la manne dans le désert. Les Israélites ne pouvaient pas en stocker pour plusieurs jours. Chaque matin, ils devaient sortir en recueillir de la nouvelle. De même, notre relation avec Dieu nécessite une fraîcheur quotidienne. Hier, nous avons expérimenté Sa grâce. Aujourd'hui, nous avons besoin d'une nouvelle portion.",
      },
      {
        type: "heading",
        text: "Dans nos moments difficiles",
      },
      {
        type: "paragraph",
        text: "Comme étudiants et jeunes professionnels, nous faisons face à de nombreux défis : pression académique, incertitude concernant l'avenir, difficultés financières, relations compliquées. Il est facile de se sentir dépassé et de douter de la présence de Dieu. Mais ce passage nous rappelle une vérité fondamentale : même quand tout semble s'écrouler autour de nous, la fidélité de Dieu demeure intacte.",
      },
      {
        type: "paragraph",
        text: "La fidélité de Dieu n'est pas conditionnée par nos circonstances ou même par notre propre fidélité. 2 Timothée 2:13 nous dit : 'Si nous sommes infidèles, il demeure fidèle, car il ne peut se renier lui-même.' C'est sa nature même. Il ne peut pas être infidèle, car cela contredirait qui Il est.",
      },
      {
        type: "heading",
        text: "Application pratique",
      },
      {
        type: "paragraph",
        text: "Comment vivre à la lumière de cette vérité ? Premièrement, commençons chaque journée en reconnaissant la fidélité de Dieu. Avant de consulter votre téléphone, avant de penser à votre emploi du temps chargé, prenez un moment pour dire : 'Seigneur, merci pour ta fidélité aujourd'hui.'",
      },
      {
        type: "paragraph",
        text: "Deuxièmement, dans les moments de doute ou de difficulté, rappelons-nous des occasions passées où Dieu s'est montré fidèle. Comme David qui se fortifiait en l'Éternel son Dieu, nous pouvons nous fortifier en nous remémorant la fidélité constante de Dieu dans notre vie.",
      },
      {
        type: "paragraph",
        text: "Troisièmement, partageons ce témoignage avec d'autres. Lorsque nous racontons comment Dieu a été fidèle envers nous, nous encourageons ceux qui nous entourent et nous fortifions notre propre foi.",
      },
    ],
    reflection: [
      "Quand avez-vous expérimenté la fidélité de Dieu de manière tangible dans votre vie ?",
      "Y a-t-il un domaine de votre vie où vous doutez actuellement de la fidélité de Dieu ? Comment ce passage peut-il vous encourager ?",
      "Comment pouvez-vous cultiver une attitude de reconnaissance quotidienne pour les compassions nouvelles de Dieu ?",
      "Avec qui pourriez-vous partager un témoignage de la fidélité de Dieu cette semaine ?",
    ],
    prayer: "Père céleste, merci pour ta fidélité qui ne faillit jamais. Merci parce que même dans mes moments les plus sombres, tu es là, constant et immuable. Aide-moi à me souvenir chaque matin que tes compassions se renouvellent pour moi. Que cette vérité transforme ma façon de voir mes défis et mes difficultés. Fortifie ma foi et aide-moi à être un témoin de ta fidélité auprès de ceux qui m'entourent. Au nom de Jésus, Amen.",
    views: 342,
  };

  const recentDevotions = [
    {
      id: 2,
      date: "1er Mars 2026",
      title: "Marcher dans l'obéissance",
      verse: "Jacques 1:22",
      image: "https://images.unsplash.com/photo-1641336406848-529f063acff6?w=400",
    },
    {
      id: 3,
      date: "29 Février 2026",
      title: "La puissance de la prière",
      verse: "Philippiens 4:6-7",
      image: "https://images.unsplash.com/photo-1761328386632-d777423bfe67?w=400",
    },
    {
      id: 4,
      date: "28 Février 2026",
      title: "L'amour qui transforme",
      verse: "1 Jean 4:19",
      image: "https://images.unsplash.com/photo-1764850068015-ea7d5d052ae5?w=400",
    },
  ];

  const handleReaction = (reactionId: string) => {
    setReactions(reactions.map(r => 
      r.id === reactionId 
        ? { ...r, active: !r.active, count: r.active ? r.count - 1 : r.count + 1 }
        : r
    ));
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      const newComment: Comment = {
        id: comments.length + 1,
        author: "Vous",
        date: "À l'instant",
        content: commentText,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
      };
      setComments([newComment, ...comments]);
      setCommentText("");
    }
  };

  const renderContent = (content: typeof devotion.content[0], index: number) => {
    switch (content.type) {
      case "paragraph":
        return (
          <p key={index} className="text-foreground leading-relaxed mb-6">
            {content.text}
          </p>
        );
      case "heading":
        return (
          <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
            {content.text}
          </h2>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-subtle">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-brand-primary transition-colors">Accueil</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/resources" className="hover:text-brand-primary transition-colors">Ressources</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Dévotion</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
              {/* Hero Section */}
              <div className="relative h-80">
                <img
                  src={devotion.image}
                  alt={devotion.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-sm font-medium">Dévotion quotidienne</span>
                  </div>
                  <h1 className="text-4xl font-bold mb-3">
                    {devotion.title}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{devotion.date}</span>
                    </div>
                    <span>•</span>
                    <span>{devotion.readTime} de lecture</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-8 py-4 bg-brand-subtle border-b border-border flex items-center justify-between">
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCompleted(!isCompleted)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      isCompleted
                        ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-brand-primary"
                        : "bg-white text-foreground border-border hover:border-brand-primary/40"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {isCompleted ? "Complété" : "Marquer comme lu"}
                    </span>
                  </button>
                  <button
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                      isBookmarked
                        ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-brand-primary"
                        : "bg-white text-foreground border-border hover:border-brand-primary/40"
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
                    <span className="text-sm font-medium">
                      {isBookmarked ? "Sauvegardé" : "Sauvegarder"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Bible Verse */}
              <div className="p-8 border-b border-border bg-brand-subtle">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5 text-brand-primary" />
                  <h3 className="font-bold text-foreground">{devotion.verse.reference}</h3>
                </div>
                <blockquote className="text-lg text-foreground italic leading-relaxed">
                  "{devotion.verse.text}"
                </blockquote>
              </div>

              {/* Content */}
              <div className="p-8 prose prose-lg max-w-none">
                {devotion.content.map((content, index) => renderContent(content, index))}
              </div>

              {/* Reflection Questions */}
              <div className="px-8 py-6 border-t border-border bg-gradient-to-br from-brand-subtle to-brand-primary/5">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-xl font-bold text-foreground">Questions de réflexion</h3>
                </div>
                <ul className="space-y-3">
                  {devotion.reflection.map((question, index) => (
                    <li key={index} className="flex items-start gap-3 text-foreground">
                      <ChevronRight className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                      <span>{question}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Prayer */}
              <div className="px-8 py-6 border-t border-border bg-brand-subtle">
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-brand-primary" />
                  <h3 className="text-xl font-bold text-foreground">Prière</h3>
                </div>
                <p className="text-foreground italic leading-relaxed">
                  {devotion.prayer}
                </p>
              </div>

              {/* Reactions */}
              <div className="px-8 py-6 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Votre réaction</h3>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {reactions.map((reaction) => {
                    const Icon = reaction.icon;
                    return (
                      <button
                        key={reaction.id}
                        onClick={() => handleReaction(reaction.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                          reaction.active
                            ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white border-brand-primary"
                            : "bg-white text-foreground border-border hover:border-brand-primary/40 hover:bg-brand-subtle"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{reaction.label}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          reaction.active ? "bg-white/20" : "bg-muted"
                        }`}>
                          {reaction.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Share Section */}
              <div className="px-8 py-6 border-t border-border bg-brand-subtle">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Partager cette dévotion</h3>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 flex items-center justify-center bg-brand-primary text-white rounded-lg hover:opacity-90 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-foreground/80 text-white rounded-lg hover:bg-foreground transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <Link
                href={`/devotion/${Number(id) - 1}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl border border-border hover:border-brand-primary/40 hover:shadow-md transition-all group"
              >
                <ArrowLeft className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary" />
                <div className="text-left">
                  <div className="text-xs text-muted-foreground mb-1">Précédent</div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-brand-primary">
                    Marcher dans l'obéissance
                  </div>
                </div>
              </Link>
              <Link
                href={`/devotion/${Number(id) + 1}`}
                className="flex items-center justify-end gap-3 p-4 bg-white rounded-xl border border-border hover:border-brand-primary/40 hover:shadow-md transition-all group"
              >
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Suivant</div>
                  <div className="text-sm font-semibold text-foreground group-hover:text-brand-primary">
                    L'amour qui transforme
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary" />
              </Link>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-border mt-8">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Témoignages et réflexions ({comments.length})
                </h3>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <div className="flex gap-3">
                    <img
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
                      alt="Votre avatar"
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Partagez comment cette dévotion vous a touché..."
                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary resize-none"
                        rows={3}
                      />
                      <div className="flex justify-end mt-3">
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium rounded-lg hover:opacity-95 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          disabled={!commentText.trim()}
                        >
                          <Send className="w-4 h-4" />
                          Publier
                        </button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <img
                        src={comment.avatar}
                        alt={comment.author}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="bg-brand-subtle rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-foreground">{comment.author}</h4>
                            <span className="text-xs text-muted-foreground">{comment.date}</span>
                          </div>
                          <p className="text-foreground">{comment.content}</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                          <button className="hover:text-brand-primary transition-colors">Amen</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 space-y-6">
              {/* Verse of the Day */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="font-bold">Verset du jour</h3>
                </div>
                <blockquote className="text-sm italic mb-2">
                  "{devotion.verse.text}"
                </blockquote>
                <p className="text-xs text-white">— {devotion.verse.reference}</p>
              </div>

              {/* Recent Devotions */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Dévotions récentes</h3>
                <div className="space-y-4">
                  {recentDevotions.map((item) => (
                    <Link
                      key={item.id}
                      href={`/devotion/${item.id}`}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground mb-1">{item.date}</p>
                        <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-brand-primary transition-colors">
                          {item.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">{item.verse}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/resources"
                  className="block mt-4 pt-4 border-t border-border text-center text-sm font-medium text-brand-primary hover:opacity-90"
                >
                  Voir toutes les dévotions
                </Link>
              </div>

              {/* Subscribe CTA */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl p-6 text-white">
                <h3 className="font-bold mb-2">Recevoir les dévotions</h3>
                <p className="text-sm text-white mb-4">
                  Recevez la dévotion quotidienne directement dans votre boîte mail chaque matin.
                </p>
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full px-4 py-2 rounded-lg mb-3 text-foreground"
                />
                <button className="w-full px-4 py-2 bg-white text-brand-primary font-semibold rounded-lg hover:bg-brand-subtle transition-colors">
                  S'abonner
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
