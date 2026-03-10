"use client";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Youtube, Clock } from "lucide-react";
import Link from "next/link";
import { PageHero } from "@/components/sections/PageHero";
import { AnimateSection } from "@/components/AnimateSection";
import { heroImages } from "@/config/heroImages";

export default function Page() {
  return (
    <div>
      <PageHero
        title="Contactez-nous"
        subtitle="Nous sommes à votre écoute. N'hésitez pas à nous contacter pour toute question ou demande d'information."
        background={heroImages.contact}
      />

      {/* ── Cartes contact (Téléphone, Email, Adresse) ── */}
      <AnimateSection className="relative py-20 sm:py-28 bg-white overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-6xl mx-auto -mt-20 sm:-mt-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            <a
              href="tel:+22527224443478"
              className="group flex flex-col items-center text-center bg-white border border-border rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(24,64,112,0.06)] hover:shadow-[0_12px_40px_rgba(24,64,112,0.12)] hover:border-brand-primary/25 transition-all duration-300"
            >
              <div className="h-[3px] w-0 group-hover:w-12 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300 mx-auto mb-6" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-brand-primary/15 group-hover:bg-brand-primary/15 group-hover:scale-105 transition-all duration-300">
                <Phone className="w-6 h-6 sm:w-7 sm:h-7 text-brand-primary" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-1.5">Téléphone</h3>
              <p className="text-sm text-muted-foreground mb-3">Appelez-nous</p>
              <span className="text-brand-primary font-semibold text-sm sm:text-base hover:underline">
                (+225) 27 22 44 43 78
              </span>
            </a>
            <a
              href="mailto:contact@aceepci.org"
              className="group flex flex-col items-center text-center bg-white border border-border rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(24,64,112,0.06)] hover:shadow-[0_12px_40px_rgba(24,64,112,0.12)] hover:border-brand-primary/25 transition-all duration-300"
            >
              <div className="h-[3px] w-0 group-hover:w-12 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300 mx-auto mb-6" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-brand-primary/15 group-hover:bg-brand-primary/15 group-hover:scale-105 transition-all duration-300">
                <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-brand-primary" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-1.5">Email</h3>
              <p className="text-sm text-muted-foreground mb-3">Envoyez-nous un email</p>
              <span className="text-brand-primary font-semibold text-sm sm:text-base hover:underline break-all">
                contact@aceepci.org
              </span>
            </a>
            <div className="group flex flex-col items-center text-center bg-white border border-border rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(24,64,112,0.06)] hover:shadow-[0_12px_40px_rgba(24,64,112,0.12)] hover:border-brand-primary/25 transition-all duration-300 sm:col-span-2 lg:col-span-1">
              <div className="h-[3px] w-0 group-hover:w-12 rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-300 mx-auto mb-6" />
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-brand-primary/15 group-hover:bg-brand-primary/15 group-hover:scale-105 transition-all duration-300">
                <MapPin className="w-6 h-6 sm:w-7 sm:h-7 text-brand-primary" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-foreground mb-1.5">Adresse</h3>
              <p className="text-sm text-muted-foreground mb-3">Rendez-nous visite</p>
              <p className="text-brand-primary font-semibold text-sm sm:text-base leading-relaxed">
                MAPE, Boulevard de l&apos;Université<br />
                Abidjan-Cocody
              </p>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Formulaire + Carte & Horaires ── */}
      <AnimateSection className="relative py-20 sm:py-28 bg-brand-subtle overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Formulaire */}
            <div className="bg-white border border-border rounded-2xl p-8 sm:p-10 shadow-[0_4px_24px_rgba(24,64,112,0.06)]">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Formulaire</p>
                <span className="w-1 h-1 rounded-full bg-brand-primary" />
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-muted-foreground mb-8 text-sm sm:text-base">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.
              </p>
              <form className="space-y-5 sm:space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-semibold text-foreground">Prénom *</label>
                    <input
                      type="text"
                      id="firstName"
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background text-foreground placeholder:text-muted-foreground text-sm"
                      placeholder="Votre prénom"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-semibold text-foreground">Nom *</label>
                    <input
                      type="text"
                      id="lastName"
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background text-foreground placeholder:text-muted-foreground text-sm"
                      placeholder="Votre nom"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-semibold text-foreground">Email *</label>
                    <input
                      type="email"
                      id="email"
                      required
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background text-sm"
                      placeholder="votre@email.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-semibold text-foreground">Téléphone</label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background text-sm"
                      placeholder="+225 XX XX XX XX XX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-sm font-semibold text-foreground">Sujet *</label>
                  <select
                    id="subject"
                    required
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background text-foreground text-sm"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="adhesion">Adhésion</option>
                    <option value="activites">Activités et événements</option>
                    <option value="don">Don et partenariat</option>
                    <option value="info">Demande d&apos;information</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-semibold text-foreground">Message *</label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary bg-background text-foreground placeholder:text-muted-foreground text-sm resize-y min-h-[120px]"
                    placeholder="Écrivez votre message ici..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg font-semibold flex items-center justify-center gap-2 hover:opacity-95 transition-opacity shadow-[0_4px_14px_rgba(24,64,112,0.25)]"
                >
                  <Send className="w-5 h-5" />
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* Carte + Horaires */}
            <div className="space-y-6">
              <div className="bg-white border border-border rounded-2xl overflow-hidden shadow-[0_4px_24px_rgba(24,64,112,0.06)]">
                <div className="aspect-[4/3] sm:aspect-video min-h-[280px]">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.3527364891243!2d-3.9858447!3d5.3599517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfc1eb7c3c7d3c53%3A0x6a9c9c9c9c9c9c9c!2sBoulevard%20de%20l'Universit%C3%A9%2C%20Abidjan%2C%20C%C3%B4te%20d'Ivoire!5e0!3m2!1sfr!2sfr!4v1234567890123!5m2!1sfr!2sfr"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte ACEEPCI - MAPE, Boulevard de l'Université, Abidjan-Cocody"
                  />
                </div>
                <div className="p-4 sm:p-5 border-t border-border">
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-brand-primary flex-shrink-0" />
                    MAPE, Boulevard de l&apos;Université, Abidjan-Cocody
                  </p>
                </div>
              </div>
              <div className="bg-white border border-border rounded-2xl p-6 sm:p-8 shadow-[0_4px_24px_rgba(24,64,112,0.06)]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-brand-primary" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-foreground">Horaires d&apos;accueil</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Lundi - Vendredi</span>
                    <span className="font-semibold text-foreground">8h00 - 17h00</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border">
                    <span className="text-muted-foreground">Samedi</span>
                    <span className="font-semibold text-foreground">9h00 - 13h00</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-muted-foreground">Dimanche</span>
                    <span className="font-semibold text-foreground">Fermé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>

      {/* ── Contacts régionaux ── */}
      <AnimateSection className="relative py-20 sm:py-28 bg-white overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-14">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Réseau</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
              Contacts régionaux
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base max-w-xl">
              Trouvez le département le plus proche de chez vous
            </p>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {[
              { region: "Abidjan - Cocody", contact: "+225 07 XX XX XX XX", email: "cocody@aceepci.org" },
              { region: "Abidjan - Yopougon", contact: "+225 07 XX XX XX XX", email: "yopougon@aceepci.org" },
              { region: "Yamoussoukro", contact: "+225 07 XX XX XX XX", email: "yamoussoukro@aceepci.org" },
              { region: "Bouaké", contact: "+225 07 XX XX XX XX", email: "bouake@aceepci.org" },
              { region: "Daloa", contact: "+225 07 XX XX XX XX", email: "daloa@aceepci.org" },
              { region: "San-Pedro", contact: "+225 07 XX XX XX XX", email: "sanpedro@aceepci.org" },
            ].map((dept, index) => (
              <div
                key={index}
                className="group flex items-start gap-4 bg-white border border-border rounded-xl p-5 sm:p-6 hover:shadow-[0_8px_28px_rgba(24,64,112,0.08)] hover:border-brand-primary/20 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center flex-shrink-0 border border-brand-primary/15 group-hover:bg-brand-primary/15 transition-colors">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-foreground mb-3 text-sm sm:text-base">{dept.region}</h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <a href={`tel:${dept.contact.replace(/\s/g, "")}`} className="flex items-center gap-2 hover:text-brand-primary transition-colors">
                      <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{dept.contact}</span>
                    </a>
                    <a href={`mailto:${dept.email}`} className="flex items-center gap-2 hover:text-brand-primary transition-colors break-all">
                      <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{dept.email}</span>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      {/* ── Nous rejoindre ── */}
      <AnimateSection className="relative py-20 sm:py-28 bg-brand-subtle overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-14">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Adhésion</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">
              Nous rejoindre
            </h2>
            <p className="text-muted-foreground mt-2 text-sm sm:text-base">
              Les étapes pour devenir membre de l&apos;ACEEPCI
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {[
              { num: "1", title: "Trouvez votre département", desc: "Localisez le département ACEEPCI de votre établissement ou votre ville" },
              { num: "2", title: "Participez aux activités", desc: "Assistez aux cultes, prières et activités de votre département" },
              { num: "3", title: "Remplissez le formulaire", desc: "Complétez le formulaire d'adhésion en ligne ou sur place" },
              { num: "4", title: "Payez votre cotisation", desc: "Effectuez le paiement de votre cotisation annuelle" },
            ].map((step) => (
              <div key={step.num} className="relative bg-white border border-border rounded-2xl p-6 sm:p-8 text-center shadow-[0_4px_24px_rgba(24,64,112,0.06)] hover:shadow-[0_12px_40px_rgba(24,64,112,0.1)] hover:border-brand-primary/20 transition-all duration-300">
                <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-[0_4px_16px_rgba(24,64,112,0.28)]">
                  <span className="text-white text-xl sm:text-2xl font-bold">{step.num}</span>
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 sm:mt-14">
            <Link
              href="/members"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg font-semibold hover:opacity-95 transition-opacity shadow-[0_4px_14px_rgba(24,64,112,0.28)]"
            >
              Commencer l&apos;adhésion
            </Link>
          </div>
        </div>
      </AnimateSection>

      {/* ── Réseaux sociaux + CTA ── */}
      <AnimateSection className="relative py-20 sm:py-28 bg-white overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Réseaux sociaux</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground uppercase tracking-tight mb-2">
              Suivez-nous
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base max-w-md mx-auto">
              Restez connectés avec nous sur nos différentes plateformes
            </p>
          </div>
          <div className="flex justify-center gap-4 sm:gap-6 mb-14">
            <a
              href="#"
              className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <a
              href="#"
              className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
            <a
              href="#"
              className="w-14 h-14 sm:w-16 sm:h-16 bg-brand-primary/10 border border-brand-primary/20 rounded-2xl flex items-center justify-center text-brand-primary hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6 sm:w-7 sm:h-7" />
            </a>
          </div>
          <div className="bg-brand-subtle border border-border rounded-2xl p-8 sm:p-10 text-center">
            <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 pl-0 sm:pl-4 border-l-0 sm:border-l-4 border-brand-primary uppercase tracking-tight">
              Une question ? Nous sommes là pour vous
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto text-sm sm:text-base">
              N&apos;hésitez pas à nous contacter par téléphone, email ou via nos réseaux sociaux
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+22527224443478"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border border-border text-foreground rounded-lg font-semibold hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-colors"
              >
                <Phone className="w-5 h-5" /> Appelez-nous
              </a>
              <a
                href="mailto:contact@aceepci.org"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-lg font-semibold hover:opacity-95 transition-opacity shadow-[0_4px_14px_rgba(24,64,112,0.28)]"
              >
                <Mail className="w-5 h-5" /> Envoyez un email
              </a>
            </div>
          </div>
        </div>
      </AnimateSection>
    </div>
  );
}
