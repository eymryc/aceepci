"use client";

import { useState } from "react";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { heroImages } from "@/config/heroImages";
import { Mail, Lock, ArrowRight, User } from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: intégrer l'authentification
  };

  return (
    <div>
      <PageHero
        title="Connexion"
        subtitle="Accédez à votre espace membre ACEEPCI"
        background={heroImages.login}
      />

      <AnimateSection className="relative bg-brand-subtle overflow-hidden py-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto -mt-24">
          <div className="max-w-md mx-auto">
            <div className="bg-white border border-border rounded-2xl shadow-[0_20px_60px_rgba(24,64,112,0.12)] overflow-hidden">
              <div className="p-8 md:p-10">
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-1 h-1 rounded-full bg-brand-primary" />
                  <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">
                    Espace membre
                  </p>
                  <span className="w-1 h-1 rounded-full bg-brand-primary" />
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground uppercase tracking-tight mb-2">
                  Se connecter
                </h2>
                <p className="text-muted-foreground mb-8">
                  Entrez vos identifiants pour accéder à votre espace personnel
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-foreground mb-2"
                    >
                      Email ou identifiant
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-foreground"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-foreground mb-2"
                    >
                      Mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary text-foreground"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary"
                      />
                      <span className="text-sm text-muted-foreground">Se souvenir de moi</span>
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-brand-primary hover:text-brand-primary-dark transition-colors"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity group"
                  >
                    Se connecter
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </form>

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Pas encore membre ?{" "}
                  <Link
                    href="/membership-form"
                    className="font-semibold text-brand-primary hover:text-brand-primary-dark transition-colors"
                  >
                    Rejoindre l&apos;ACEEPCI
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>

      <AnimateSection className="relative bg-brand-primary-dark overflow-hidden py-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-1 h-1 rounded-full bg-brand-light" />
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">
              Besoin d&apos;aide ?
            </p>
            <span className="w-1 h-1 rounded-full bg-brand-light" />
          </div>
          <h2 className="font-serif text-xl md:text-2xl font-bold text-white uppercase tracking-tight mb-2">
            Problème de connexion ?
          </h2>
          <p className="text-white mb-6 max-w-xl mx-auto">
            Contactez-nous à{" "}
            <a
              href="mailto:contact@aceepci.org"
              className="text-brand-light hover:underline"
            >
              contact@aceepci.org
            </a>{" "}
            pour toute assistance.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-brand-light text-white text-sm font-medium rounded-lg hover:bg-brand-light hover:text-brand-primary-dark transition-all"
          >
            <User className="w-4 h-4" />
            Nous contacter
          </Link>
        </div>
      </AnimateSection>
    </div>
  );
}
