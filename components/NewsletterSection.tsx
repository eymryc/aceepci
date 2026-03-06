"use client";
import { useState, type MouseEvent } from "react";
import { ArrowRight, Mail, CheckCircle, Users, Bell, BookOpen, Shield } from "lucide-react";

const PERKS = [
  { icon: Bell,     label: "Actualités communautaires", desc: "Toutes les nouvelles en avant-première" },
  { icon: Users,    label: "Événements à venir",        desc: "Calendrier mensuel des activités"       },
  { icon: BookOpen, label: "Ressources spirituelles",   desc: "Articles, guides et réflexions"         },
  { icon: Shield,   label: "Sans spam",                 desc: "Désinscription en un clic"              },
];

const STATS = [
  { value: "1 200+", label: "Abonnés" },
  { value: "4 ans",  label: "D'existence" },
  { value: "Mensuel", label: "Rythme d'envoi" },
];

export default function NewsletterSection() {
  const [email, setEmail]   = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1300));
    setStatus("success");
  };

  return (
    <section className="relative bg-background overflow-hidden py-24 px-4 sm:px-6 lg:px-8">

      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* ── LEFT: copy ── */}
          <div>
            {/* Eyebrow */}
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">
                Newsletter mensuelle
              </p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>

            {/* Title */}
            <h2 className="font-serif text-4xl md:text-[3.25rem] font-bold text-foreground leading-[1.08] mb-5">
              Ne manquez rien<br />
              de <em className="not-italic italic text-brand-primary">l&apos;ACEEPCI</em>
            </h2>

            {/* Subtitle */}
            <p className="text-[1rem] font-light text-muted-foreground leading-relaxed mb-8 max-w-sm">
              Chaque mois, recevez un condensé de nos actualités, événements et ressources directement dans votre boîte mail.
            </p>

            {/* Stats row */}
            <div className="flex gap-6 mb-10 pb-10 border-b border-border">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-serif text-2xl font-bold text-brand-primary">{s.value}</p>
                  <p className="text-xs font-light text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Perks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PERKS.map(({ icon: Icon, label, desc }) => (
                <div key={label} className="flex items-start gap-3">
                  <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-brand-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{label}</p>
                    <p className="text-xs font-light text-muted-foreground mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: form card ── */}
          <div className="relative">
            <div className="relative bg-brand-subtle border border-border rounded-2xl p-8 md:p-10">

              {/* Card header */}
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_6px_20px_rgba(24,64,112,0.25)] flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Rejoignez notre communauté</p>
                  <p className="text-xs font-light text-muted-foreground">Inscription gratuite · 1 200 membres</p>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-brand-primary/50 via-brand-primary/20 to-transparent mb-8" />

              {status === "success" ? (
                <div className="py-6 flex flex-col items-center text-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[rgba(52,199,89,0.12)] border border-[rgba(52,199,89,0.25)] flex items-center justify-center">
                    <CheckCircle className="w-8 h-8 text-[#34c759]" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-lg font-serif font-semibold text-foreground mb-1">Bienvenue parmi nous !</p>
                    <p className="text-sm font-bold text-muted-foreground">
                      Votre inscription est confirmée. Vous recevrez notre prochaine édition sous peu.
                    </p>
                  </div>
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
                  <p className="text-xs text-muted-foreground">Pensez à vérifier vos spams si besoin.</p>
                </div>
              ) : (
                <>
                  {/* Email label */}
                  <label className="block text-xs font-medium tracking-wider uppercase text-muted-foreground mb-2">
                    Adresse email
                  </label>

                  {/* Input */}
                  <div className="relative mb-4">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                    <input
                      type="email"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-11 pr-4 py-3.5 bg-background border border-border rounded-lg text-foreground text-sm font-bold placeholder:text-muted-foreground focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={status === "loading"}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-lg shadow-[0_4px_20px_rgba(24,64,112,0.25)] hover:shadow-[0_6px_28px_rgba(24,64,112,0.4)] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all group"
                  >
                    {status === "loading" ? (
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        S&apos;inscrire gratuitement
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>

                  {/* Fine print */}
                  <p className="mt-4 text-center text-[0.7rem] font-light text-muted-foreground">
                    Désinscription en un clic · Aucune donnée partagée
                  </p>
                </>
              )}
            </div>

            <div className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full border border-brand-primary/15 pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full border border-brand-primary/10 pointer-events-none" />
          </div>

        </div>
      </div>
    </section>
  );
}