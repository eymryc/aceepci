"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  Clock, 
  User, 
  Tag, 
  ChevronRight, 
  ThumbsUp, 
  Heart, 
  Lightbulb,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  MessageCircle,
  Send
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
  const [reactions, setReactions] = useState<Reaction[]>([
    { id: "like", icon: ThumbsUp, label: "J'aime", count: 45, active: false },
    { id: "love", icon: Heart, label: "J'adore", count: 28, active: false },
    { id: "insightful", icon: Lightbulb, label: "Instructif", count: 12, active: false },
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: "Emmanuel Koné",
      date: "1 Mars 2026",
      content: "Merci pour ce témoignage inspirant ! Cela m'encourage beaucoup dans mon propre parcours universitaire. Que Dieu vous bénisse !",
      avatar: "https://images.unsplash.com/photo-1639436926668-2f8b4f32e15a?w=100",
    },
    {
      id: 2,
      author: "Marie Yao",
      date: "29 Février 2026",
      content: "Amen ! Je peux vraiment m'identifier à votre histoire. La foi est vraiment notre force dans les moments difficiles.",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
    },
    {
      id: 3,
      author: "David Kouassi",
      date: "28 Février 2026",
      content: "Gloire à Dieu pour ce qu'Il a fait dans votre vie ! Ce témoignage me rappelle que rien n'est impossible avec Dieu.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
  ]);

  const [commentText, setCommentText] = useState("");

  // Données de l'article (normalement récupérées via l'API avec l'ID)
  const post = {
    id: 1,
    title: "Comment Dieu a transformé ma vie universitaire",
    category: "Témoignages",
    author: {
      name: "Sarah Kouadio",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100",
      bio: "Étudiante en Sciences Économiques et membre active de l'ACEEPCI depuis 2023",
    },
    date: "28 Février 2026",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1714667109984-9602d193d1ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaHJpc3RpYW4lMjB5b3V0aCUyMHdvcnNoaXAlMjBiaWJsZXxlbnwxfHx8fDE3NzI1ODI0MDV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    views: 1245,
    content: [
      {
        type: "paragraph",
        text: "Lorsque j'ai commencé mes études universitaires en 2021, j'étais remplie d'espoir et d'ambition. Cependant, les premiers mois ont été bien plus difficiles que ce que j'avais imaginé. Entre l'adaptation au rythme universitaire, la pression académique et l'éloignement de ma famille, je me suis rapidement sentie dépassée et découragée.",
      },
      {
        type: "heading",
        text: "Le tournant de ma vie",
      },
      {
        type: "paragraph",
        text: "C'est lors de mon deuxième semestre que j'ai découvert l'ACEEPCI grâce à une camarade de classe. Au début, j'étais sceptique. Je me demandais si j'avais vraiment le temps pour des activités en dehors de mes cours. Mais quelque chose me poussait à essayer, et c'est la meilleure décision que j'aie jamais prise.",
      },
      {
        type: "paragraph",
        text: "Ma première participation à une réunion de prière a complètement changé ma perspective. J'ai rencontré des jeunes qui partageaient les mêmes valeurs que moi, qui comprenaient mes luttes et qui étaient prêts à prier avec moi. Pour la première fois depuis longtemps, je ne me sentais plus seule.",
      },
      {
        type: "quote",
        text: "\"Fortifie-toi et prends courage ! Ne t'effraie point et ne t'épouvante point, car l'Éternel, ton Dieu, est avec toi dans tout ce que tu entreprendras.\" - Josué 1:9",
      },
      {
        type: "heading",
        text: "La transformation progressive",
      },
      {
        type: "paragraph",
        text: "Les mois suivants ont été marqués par une transformation progressive mais réelle. J'ai appris à gérer mon temps différemment, en plaçant Dieu au centre de mes priorités. Les moments de culte personnel et les réunions avec l'ACEEPCI sont devenus mes sources de force et de motivation.",
      },
      {
        type: "paragraph",
        text: "Mes notes se sont améliorées, non pas parce que j'étudiais plus longtemps, mais parce que j'étudiais mieux. J'avais trouvé un équilibre entre vie spirituelle, vie académique et vie sociale. Les frères et sœurs de l'ACEEPCI sont devenus ma famille loin de chez moi.",
      },
      {
        type: "heading",
        text: "Les leçons apprises",
      },
      {
        type: "list",
        items: [
          "La prière change vraiment les choses - pas seulement nos circonstances, mais surtout notre perspective",
          "La communauté chrétienne est essentielle pour notre croissance spirituelle et personnelle",
          "Dieu a un plan pour chaque aspect de notre vie, y compris nos études",
          "Les défis sont des opportunités pour voir la fidélité de Dieu",
        ],
      },
      {
        type: "paragraph",
        text: "Aujourd'hui, je suis en troisième année et je peux témoigner de la fidélité de Dieu dans ma vie universitaire. Non seulement j'ai obtenu de bonnes notes, mais j'ai aussi développé des relations authentiques, découvert mes talents de leadership, et surtout, j'ai approfondi ma relation avec Christ.",
      },
      {
        type: "paragraph",
        text: "Si vous traversez des moments difficiles dans votre parcours universitaire, sachez que vous n'êtes pas seul. Dieu est avec vous, et Il a préparé une communauté pour vous soutenir. N'hésitez pas à rejoindre l'ACEEPCI ou à vous rapprocher d'une communauté chrétienne sur votre campus. C'est peut-être le début de votre propre transformation.",
      },
    ],
  };

  const relatedPosts = [
    {
      id: 2,
      title: "L'importance de la communauté chrétienne à l'université",
      image: "https://images.unsplash.com/photo-1716654716581-3c92ba53de10?w=400",
    },
    {
      id: 5,
      title: "De l'échec aux premiers de promotion : Mon parcours",
      image: "https://images.unsplash.com/photo-1639436926668-2f8b4f32e15a?w=400",
    },
    {
      id: 9,
      title: "Mission humanitaire à Bouaké : Témoignages",
      image: "https://images.unsplash.com/photo-1567398724206-be8c8f0f8e41?w=400",
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

  const renderContent = (content: typeof post.content[0], index: number) => {
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
      case "quote":
        return (
          <blockquote key={index} className="border-l-4 border-brand-primary bg-brand-subtle pl-6 pr-4 py-4 my-6 italic text-foreground">
            {content.text}
          </blockquote>
        );
      case "list":
        return (
          <ul key={index} className="space-y-3 mb-6">
            {content.items?.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground">
                <ChevronRight className="w-5 h-5 text-brand-primary flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
            <Link href="/blog" className="hover:text-brand-primary transition-colors">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground font-medium">Article</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <article className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
              {/* Hero Image */}
              <div className="relative h-96">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <span className="inline-block px-3 py-1 bg-brand-primary rounded-full text-xs font-medium mb-4">
                    {post.category}
                  </span>
                  <h1 className="text-4xl font-bold mb-4">
                    {post.title}
                  </h1>
                </div>
              </div>

              {/* Article Meta */}
              <div className="p-8 border-b border-border">
                <div className="flex items-center gap-6 flex-wrap">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold text-foreground">{post.author.name}</div>
                      <div className="text-sm text-muted-foreground">{post.author.bio}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground ml-auto">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{post.readTime} de lecture</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Article Content */}
              <div className="p-8 prose prose-lg max-w-none">
                {post.content.map((content, index) => renderContent(content, index))}
              </div>

              {/* Reactions */}
              <div className="px-8 py-6 border-t border-border">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-muted-foreground" />
                  <h3 className="font-semibold text-foreground">Votre avis sur cet article</h3>
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
                  <h3 className="font-semibold text-foreground">Partager cet article</h3>
                  <div className="flex gap-3">
                    <button className="w-10 h-10 flex items-center justify-center bg-brand-primary text-white rounded-lg hover:opacity-90 transition-colors">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                      <Twitter className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-brand-primary text-white rounded-lg hover:opacity-90 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </button>
                    <button className="w-10 h-10 flex items-center justify-center bg-foreground/80 text-white rounded-lg hover:bg-foreground transition-colors">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-xl shadow-sm border border-border mt-8">
              <div className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  Commentaires ({comments.length})
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
                        placeholder="Partagez votre réflexion ou encouragement..."
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
                          <button className="hover:text-brand-primary transition-colors">Répondre</button>
                          <button className="hover:text-brand-primary transition-colors">J'aime</button>
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
              {/* Author Card */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <div className="text-center">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
                  />
                  <h3 className="font-bold text-foreground mb-2">{post.author.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{post.author.bio}</p>
                  <button className="w-full px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white font-medium rounded-lg hover:opacity-95 transition-colors">
                    Suivre
                  </button>
                </div>
              </div>

              {/* Related Posts */}
              <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                <h3 className="font-bold text-foreground mb-4">Articles similaires</h3>
                <div className="space-y-4">
                  {relatedPosts.map((relatedPost) => (
                    <Link
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.id}`}
                      className="flex gap-3 group cursor-pointer"
                    >
                      <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
                        <img
                          src={relatedPost.image}
                          alt={relatedPost.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-foreground line-clamp-3 group-hover:text-brand-primary transition-colors">
                          {relatedPost.title}
                        </h4>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl p-6 text-white">
                <h3 className="font-bold mb-2">Restez informé</h3>
                <p className="text-sm text-white mb-4">
                  Recevez nos derniers articles et actualités directement par email.
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
