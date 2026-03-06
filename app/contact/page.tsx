"use client";
import { Mail, Phone, MapPin, Send, Facebook, Instagram, Youtube } from "lucide-react";
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

      <AnimateSection className="relative py-24 bg-brand-subtle overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "radial-gradient(var(--brand-primary) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 max-w-7xl mx-auto -mt-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-[0_8px_28px_rgba(24,64,112,0.08)] hover:border-brand-primary/20 transition-colors">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-primary/20">
                <Phone className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Téléphone</h3>
              <p className="text-muted-foreground mb-2">Appelez-nous</p>
              <a href="tel:+22527224443478" className="text-brand-primary hover:text-brand-primary-dark font-semibold">
                (+225) 27 22 44 43 78
              </a>
            </div>
            <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-[0_8px_28px_rgba(24,64,112,0.08)] hover:border-brand-primary/20 transition-colors">
              <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-brand-primary/20">
                <Mail className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Email</h3>
              <p className="text-muted-foreground mb-2">Envoyez-nous un email</p>
              <a href="mailto:contact@aceepci.org" className="text-brand-primary hover:text-brand-primary-dark font-semibold">
                contact@aceepci.org
              </a>
            </div>
            <div className="bg-white border border-border rounded-2xl p-8 text-center shadow-[0_8px_28px_rgba(24,64,112,0.08)] hover:border-brand-primary/20 transition-colors">
              <div className="w-16 h-16 bg-brand-subtle rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-brand-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Adresse</h3>
              <p className="text-muted-foreground mb-2">Rendez-nous visite</p>
              <p className="text-brand-primary font-semibold">
                MAPE, Boulevard de l&apos;Université<br />
                Abidjan-Cocody
              </p>
            </div>
          </div>
        </div>
      </AnimateSection>

      <AnimateSection className="relative py-24 bg-brand-primary-dark overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-1 h-1 rounded-full bg-brand-light" />
                <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">Formulaire</p>
                <span className="w-1 h-1 rounded-full bg-brand-light" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-white uppercase tracking-tight mb-2">Envoyez-nous un message</h2>
              <p className="text-white mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais
              </p>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-white mb-2">Prénom *</label>
                    <input type="text" id="firstName" required className="w-full px-4 py-3 border border-white/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white/5 text-white placeholder:text-white" placeholder="Votre prénom" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-white mb-2">Nom *</label>
                    <input type="text" id="lastName" required className="w-full px-4 py-3 border border-white/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white/5 text-white placeholder:text-white" placeholder="Votre nom" />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">Email *</label>
                    <input type="email" id="email" required className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-background" placeholder="votre@email.com" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">Téléphone</label>
                    <input type="tel" id="phone" className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary bg-background" placeholder="+225" />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-white mb-2">Sujet *</label>
                  <select id="subject" required className="w-full px-4 py-3 border border-white/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white/5 text-white">
                    <option value="">Sélectionnez un sujet</option>
                    <option value="adhesion">Adhésion</option>
                    <option value="activites">Activités et événements</option>
                    <option value="don">Don et partenariat</option>
                    <option value="info">Demande d'information</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-white mb-2">Message *</label>
                  <textarea id="message" required rows={6} className="w-full px-4 py-3 border border-white/20 rounded-sm focus:outline-none focus:ring-2 focus:ring-brand-primary bg-white/5 text-white placeholder:text-white" placeholder="Écrivez votre message ici..." />
                </div>
                <button type="submit" className="w-full py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-sm font-semibold flex items-center justify-center hover:opacity-95 transition-opacity">
                  <Send className="w-5 h-5 mr-2" />
                  Envoyer le message
                </button>
              </form>
            </div>
            <div>
              <div className="bg-white/5 border border-white/10 rounded-2xl h-96 mb-6 overflow-hidden">
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
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Horaires</h3>
                <div className="space-y-3">
                  <div className="flex justify-between"><span>Lundi - Vendredi</span><span className="font-semibold">8h00 - 17h00</span></div>
                  <div className="flex justify-between"><span>Samedi</span><span className="font-semibold">9h00 - 13h00</span></div>
                  <div className="flex justify-between"><span>Dimanche</span><span className="font-semibold">Fermé</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimateSection>

      <AnimateSection className="relative py-24 bg-brand-subtle overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Réseau</p>
              <span className="w-1 h-1 rounded-full bg-brand-primary" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground uppercase tracking-tight">Contacts régionaux</h2>
            <p className="text-muted-foreground mt-1">Trouvez le département le plus proche de chez vous</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { region: "Abidjan - Cocody", contact: "+225 07 XX XX XX XX", email: "cocody@aceepci.org" },
              { region: "Abidjan - Yopougon", contact: "+225 07 XX XX XX XX", email: "yopougon@aceepci.org" },
              { region: "Yamoussoukro", contact: "+225 07 XX XX XX XX", email: "yamoussoukro@aceepci.org" },
              { region: "Bouaké", contact: "+225 07 XX XX XX XX", email: "bouake@aceepci.org" },
              { region: "Daloa", contact: "+225 07 XX XX XX XX", email: "daloa@aceepci.org" },
              { region: "San-Pedro", contact: "+225 07 XX XX XX XX", email: "sanpedro@aceepci.org" }
            ].map((dept, index) => (
              <div key={index} className="bg-white border border-border rounded-xl p-6 hover:shadow-[0_8px_28px_rgba(24,64,112,0.08)] hover:border-brand-primary/20 transition-all">
                <h3 className="font-bold text-foreground mb-3">{dept.region}</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center"><Phone className="w-4 h-4 mr-2" />{dept.contact}</div>
                  <div className="flex items-center"><Mail className="w-4 h-4 mr-2" />{dept.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimateSection>

      <AnimateSection className="relative py-24 bg-brand-primary-dark overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1 h-1 rounded-full bg-brand-light" />
              <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-light">Adhésion</p>
              <span className="w-1 h-1 rounded-full bg-brand-light" />
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white uppercase tracking-tight">Nous rejoindre</h2>
            <p className="text-white mt-1">Les étapes pour devenir membre de l&apos;ACEEPCI</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { num: "1", title: "Trouvez votre département", desc: "Localisez le département ACEEPCI de votre établissement ou votre ville" },
              { num: "2", title: "Participez aux activités", desc: "Assistez aux cultes, prières et activités de votre département" },
              { num: "3", title: "Remplissez le formulaire", desc: "Complétez le formulaire d'adhésion en ligne ou sur place" },
              { num: "4", title: "Payez votre cotisation", desc: "Effectuez le paiement de votre cotisation annuelle" }
            ].map((step) => (
              <div key={step.num} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-brand-primary to-brand-accent rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_4px_16px_rgba(24,64,112,0.3)]"><span className="text-white text-2xl font-bold">{step.num}</span></div>
                <h3 className="font-bold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-white">{step.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-left mt-12">
            <Link href="/members" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-accent text-white rounded-sm font-semibold hover:opacity-95 transition-opacity">
              Commencer l&apos;adhésion
            </Link>
          </div>
        </div>
      </AnimateSection>

      <AnimateSection className="relative py-24 bg-brand-subtle overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
            <p className="text-[0.7rem] font-medium tracking-[0.22em] uppercase text-brand-primary">Réseaux sociaux</p>
            <span className="w-1 h-1 rounded-full bg-brand-primary" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-foreground uppercase tracking-tight mb-1">Suivez-nous</h2>
          <p className="text-muted-foreground mb-8">Restez connectés avec nous sur nos différentes plateformes</p>
          <div className="flex gap-4">
            <a href="#" className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Facebook"><Facebook className="w-8 h-8 text-white" /></a>
            <a href="#" className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="Instagram"><Instagram className="w-8 h-8 text-white" /></a>
            <a href="#" className="w-16 h-16 bg-brand-primary rounded-full flex items-center justify-center hover:opacity-90 transition-opacity" aria-label="YouTube"><Youtube className="w-8 h-8 text-white" /></a>
          </div>
        </div>
      </AnimateSection>

      <AnimateSection className="relative py-24 bg-brand-primary-dark overflow-hidden px-4 sm:px-6 lg:px-8">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-accent to-transparent" />
        <div className="relative z-10 max-w-4xl mx-auto text-white">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 pl-4 border-l-4 border-brand-light uppercase tracking-tight">Une question ? Nous sommes là pour vous</h2>
          <p className="text-lg text-white mb-8 max-w-2xl">N&apos;hésitez pas à nous contacter par téléphone, email ou via nos réseaux sociaux</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="tel:+22527224443478" className="px-8 py-4 bg-white text-brand-primary rounded-sm hover:opacity-95 transition-opacity font-semibold inline-flex items-center">
              <Phone className="w-5 h-5 mr-2" /> Appelez-nous
            </a>
            <a href="mailto:contact@aceepci.org" className="px-8 py-4 bg-brand-accent text-white rounded-sm hover:opacity-95 transition-opacity font-semibold inline-flex items-center">
              <Mail className="w-5 h-5 mr-2" /> Envoyez un email
            </a>
          </div>
        </div>
      </AnimateSection>
    </div>
  );
}
