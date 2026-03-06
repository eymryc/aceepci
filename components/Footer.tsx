import Link from "next/link";
import { Facebook, Instagram, Youtube, Phone, Mail, MapPin, ArrowRight, Heart } from "lucide-react";
import { siteConfig, navConfig, contactConfig } from "@/config/site";
import Image from "next/image";

const LOGO_SRC = "/assets/WhatsApp Image 2026-03-05 at 09.42.00.jpeg";

export function Footer() {
  const flatLinks: { name: string; href: string }[] = [];
  for (const item of navConfig) {
    if ("subItems" in item) {
      flatLinks.push(...item.subItems.map((s) => ({ name: s.name, href: s.href })));
    } else {
      flatLinks.push({ name: item.name, href: item.href });
    }
  }

  const socialIcon = (name: string) => {
    if (name === "Facebook")  return <Facebook  className="w-4 h-4" />;
    if (name === "Instagram") return <Instagram className="w-4 h-4" />;
    if (name === "YouTube")   return <Youtube   className="w-4 h-4" />;
    return null;
  };

  return (
    <footer className="relative bg-brand-primary-dark overflow-hidden">

      {/* Orbs */}
      <div className="pointer-events-none absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.16)_0%,transparent_70%)]" />
      <div className="pointer-events-none absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(24,64,112,0.10)_0%,transparent_70%)]" />
      {/* Top rule */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-white/50 to-transparent" />

      {/* ── Main grid ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-14">

          {/* ── Col 1 : Brand ── */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 mb-5 group">
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_4px_14px_rgba(24,64,112,0.35)] flex items-center justify-center flex-shrink-0 overflow-hidden">
                <Image
                  src={encodeURI(LOGO_SRC)}
                  alt="Logo ACEEPCI"
                  fill
                  sizes="44px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="font-serif text-base font-bold text-white leading-tight">{siteConfig.name}</div>
                <div className="text-[0.6rem] font-medium tracking-[0.18em] uppercase text-brand-light">Connaître — Aimer — Servir</div>
              </div>
            </Link>

            <p className="text-xs font-normal text-white leading-relaxed mb-5">
              {siteConfig.fullName}
            </p>

            {/* Slogan */}
            <div className="pl-4 border-l-[3px] border-brand-accent">
              <p className="font-serif text-sm italic text-brand-light">
                « {siteConfig.slogan} »
              </p>
            </div>
          </div>

          {/* ── Col 2 : Liens rapides ── */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1 h-1 rounded-full bg-brand-accent" />
              <h3 className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-brand-light">
                Liens rapides
              </h3>
            </div>
            <ul className="space-y-2.5">
              {flatLinks.slice(0, 7).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm font-normal text-white hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-3 h-3 text-brand-light opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all flex-shrink-0" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3 : Contact ── */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1 h-1 rounded-full bg-brand-accent" />
              <h3 className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-brand-light">
                Contact
              </h3>
            </div>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-0.5 w-7 h-7 rounded-lg bg-brand-primary/15 border-2 border-brand-primary/45 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-brand-light" />
                </div>
                <span className="text-sm font-normal text-white leading-relaxed">
                  {contactConfig.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-primary/15 border-2 border-brand-primary/45 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3.5 h-3.5 text-brand-light" />
                </div>
                <a
                  href={`tel:${contactConfig.phone.replace(/\s/g, "")}`}
                  className="text-sm font-normal text-white hover:text-white transition-colors"
                >
                  {contactConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-brand-primary/15 border-2 border-brand-primary/45 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-brand-light" />
                </div>
                <a
                  href={`mailto:${contactConfig.email}`}
                  className="text-sm font-normal text-white hover:text-white transition-colors"
                >
                  {contactConfig.email}
                </a>
              </li>
            </ul>
          </div>

          {/* ── Col 4 : Réseaux & CTA ── */}
          <div>
            <div className="flex items-center gap-2 mb-5">
              <span className="w-1 h-1 rounded-full bg-brand-accent" />
              <h3 className="text-[0.7rem] font-medium tracking-[0.2em] uppercase text-brand-light">
                Suivez-nous
              </h3>
            </div>

            {/* Social icons */}
            <div className="flex gap-2 mb-8">
              {contactConfig.social.map(({ name, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-9 h-9 rounded-sm bg-white/5 border-2 border-white/40 text-white flex items-center justify-center hover:bg-brand-primary/20 hover:border-brand-primary/50 hover:text-brand-light transition-all"
                >
                  {socialIcon(name)}
                </a>
              ))}
            </div>

            {/* Mini CTA */}
            <div className="bg-brand-primary/15 border-2 border-brand-primary/45 rounded-lg p-4">
              <p className="text-xs font-normal text-white mb-3 leading-relaxed">
                Soutenir notre mission par un don, c'est investir dans la jeunesse.
              </p>
              <Link
                href="/payments"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-xs font-medium rounded-sm shadow-[0_4px_12px_rgba(24,64,112,0.26)] hover:shadow-[0_4px_18px_rgba(24,64,112,0.42)] hover:-translate-y-px transition-all group"
              >
                Faire un don
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t-2 border-white/40 pt-7 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-normal text-white text-center sm:text-left">
            © {new Date().getFullYear()} {siteConfig.name} — Fondée le {siteConfig.founded}. Tous droits réservés.
          </p>
          <p className="flex items-center gap-1.5 text-xs font-normal text-white">
            Fait avec <Heart className="w-3 h-3 text-brand-light" /> en Côte d&apos;Ivoire
          </p>
        </div>
      </div>
    </footer>
  );
}