"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, ArrowRight, Shield, LogOut, User } from "lucide-react";
import { navConfig } from "@/config/site";
import { useAuth } from "@/contexts/AuthContext";

const LOGO_SRC = "/assets/WhatsApp Image 2026-03-05 at 09.42.00.jpeg";

export function Header() {
  const [isMenuOpen, setIsMenuOpen]     = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [userMenuOpen, setUserMenuOpen]  = useState(false);
  const [scrolled, setScrolled]         = useState(false);
  const pathname  = usePathname();
  const navigation = navConfig;
  const { user, isAuthenticated, logout } = useAuth();

  // Scroll-aware transparent → solid
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setIsMenuOpen(false); setOpenDropdown(null); }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/activities" && pathname.startsWith("/event-registration")) return true;
    if ((href === "/members" || href === "/payments" || href === "/offers") && pathname.startsWith("/membership")) return true;
    if (href === "/resources" && pathname.startsWith("/devotion")) return true;
    return pathname.startsWith(href);
  };

  const isDropdownActive = (subItems: readonly { href: string }[]) =>
    subItems.some((item) => isActive(item.href));

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-brand-primary-dark/95 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.25)] border-b border-brand-primary/20"
          : "bg-brand-primary-dark border-b border-brand-primary/15"
      }`}
    >
      {/* Gold top rule */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-accent to-transparent" />

      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent shadow-[0_4px_14px_rgba(24,64,112,0.4)] flex items-center justify-center flex-shrink-0 group-hover:shadow-[0_4px_20px_rgba(24,64,112,0.55)] transition-shadow">
              <Image
                src={encodeURI(LOGO_SRC)}
                alt="Logo ACEEPCI"
                fill
                sizes="44px"
                className="rounded-full object-cover"
                priority
              />
            </div>
          </Link>

          {/* ── Desktop nav ── */}
          <div className="hidden lg:flex items-center gap-1 flex-shrink-0 flex-nowrap">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative flex-shrink-0"
                onMouseEnter={() => "subItems" in item && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                {"subItems" in item ? (
                  <>
                    <button
                      className={`relative flex items-center gap-1 px-3 py-2.5 text-xs xl:text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                        isDropdownActive(item.subItems ?? [])
                          ? "text-brand-primary-dark bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                          : "text-white hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-3.5 h-3.5 flex-shrink-0 transition-transform duration-200 ${openDropdown === item.name ? "rotate-180" : ""}`}
                      />
                    </button>

                    {/* Dropdown */}
                    {openDropdown === item.name && (
                      <div className="absolute top-full left-0 pt-3 w-52 z-50">
                        <div className="bg-brand-primary-dark border border-brand-primary/25 rounded-lg shadow-[0_12px_40px_rgba(0,0,0,0.45)] overflow-hidden">
                          {/* Gold top accent */}
                          <div className="h-[2px] bg-gradient-to-r from-brand-accent to-transparent" />
                          <div className="py-1.5">
                            {(item.subItems ?? []).map((subItem) => (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`flex items-center justify-between px-4 py-2.5 text-sm transition-colors group/sub border-l-2 ${
                                  isActive(subItem.href)
                                    ? "text-white bg-brand-primary/25 border-brand-accent font-medium"
                                    : "text-white hover:text-white hover:bg-white/5 border-transparent"
                                }`}
                              >
                                {subItem.name}
                                <ArrowRight className="w-3 h-3 opacity-0 group-hover/sub:opacity-100 transition-opacity -translate-x-1 group-hover/sub:translate-x-0 transition-transform" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`px-3 py-2.5 text-xs xl:text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                      isActive(item.href)
                        ? "text-brand-primary-dark bg-white shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                        : "text-white hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            {/* CTA buttons */}
            {/* <Link
              href="/admin"
              className="ml-2 inline-flex items-center gap-2 px-3 py-2.5 text-xs xl:text-sm font-medium text-white/80 hover:text-white hover:bg-white/5 rounded-full transition-all whitespace-nowrap flex-shrink-0"
              title="Administration"
            >
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span className="sr-only lg:not-sr-only">Admin</span>
            </Link> */}
            {isAuthenticated ? (
              <div className="relative ml-2 pb-2" onMouseEnter={() => setUserMenuOpen(true)} onMouseLeave={() => setUserMenuOpen(false)}>
                <button
                  className="inline-flex items-center gap-2 px-3 py-2.5 text-xs xl:text-sm font-medium rounded-full border border-white/30 text-white hover:bg-white/10 whitespace-nowrap flex-shrink-0"
                >
                  <User className="w-4 h-4" />
                  {user?.firstname ?? user?.username ?? "Mon compte"}
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute top-full right-0 pt-2 w-48 z-[100]">
                    <div className="py-2 bg-brand-primary-dark border border-brand-primary/25 rounded-lg shadow-xl">
                      <Link href="/members" className="flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 transition-colors" onClick={() => setUserMenuOpen(false)}>
                        <User className="w-4 h-4" />
                        Mon espace
                      </Link>
                      <button onClick={() => { logout(); setUserMenuOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-white hover:bg-white/10 text-left transition-colors">
                        <LogOut className="w-4 h-4" />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className={`ml-2 inline-flex items-center gap-2 px-3 py-2.5 text-xs xl:text-sm font-medium rounded-full transition-all whitespace-nowrap flex-shrink-0 ${
                  isActive("/login")
                    ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white shadow-[0_4px_12px_rgba(24,64,112,0.3)]"
                    : "border border-white/30 text-white hover:bg-white/10"
                }`}
              >
                Se connecter
              </Link>
            )}
            <Link
              href="/payments"
              className="ml-2 inline-flex items-center gap-2 px-3 py-2.5 bg-white text-brand-primary text-xs xl:text-sm font-medium rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.12)] hover:bg-brand-subtle hover:text-brand-primary-dark transition-all group whitespace-nowrap flex-shrink-0"
            >
              Faire un don
              <ArrowRight className="w-3.5 h-3.5 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-sm border border-white/10 flex items-center justify-center text-white hover:bg-white/5 transition-colors"
            aria-label="Menu"
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-white/5 py-4">
            {/* Gold rule */}
            <div className="h-px bg-gradient-to-r from-brand-accent via-brand-accent/30 to-transparent mb-4" />

            <div className="flex flex-col gap-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {"subItems" in item ? (
                    <>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-full transition-colors ${
                          isDropdownActive(item.subItems ?? [])
                            ? "text-brand-primary-dark bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                            : "text-white hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.name}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${openDropdown === item.name ? "rotate-180" : ""}`}
                        />
                      </button>
                      {openDropdown === item.name && (
                        <div className="ml-4 mt-1 mb-1 space-y-0.5 border-l border-brand-primary/30 pl-3">
                          {(item.subItems ?? []).map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-sm transition-colors border-l-2 ${
                                isActive(subItem.href)
                                  ? "text-white font-medium bg-brand-primary/20 border-brand-accent"
                                  : "text-white hover:text-white border-transparent"
                              }`}
                            >
                              <span className="w-1 h-1 rounded-full bg-brand-accent flex-shrink-0" />
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-full transition-colors ${
                        isActive(item.href)
                          ? "text-brand-primary-dark bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
                          : "text-white hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}

              {/* Mobile CTA */}
              <Link
                href="/admin"
                className="mt-3 mx-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-full border border-white/20 text-white"
              >
                <Shield className="w-4 h-4" />
                Administration
              </Link>
              {isAuthenticated ? (
                <>
                  <Link href="/members" className="mt-3 mx-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-full border border-white/30 text-white" onClick={() => setIsMenuOpen(false)}>
                    <User className="w-4 h-4" />
                    Mon espace
                  </Link>
                  <button onClick={() => { logout(); setIsMenuOpen(false); }} className="mt-2 mx-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-full border border-white/30 text-white w-[calc(100%-8px)]">
                    <LogOut className="w-4 h-4" />
                    Se déconnecter
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`mt-3 mx-1 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-full ${
                    isActive("/login")
                      ? "bg-gradient-to-r from-brand-primary to-brand-accent text-white"
                      : "border border-white/30 text-white"
                  }`}
                >
                  Se connecter
                </Link>
              )}
              <Link
                href="/payments"
                className="mt-2 mx-1 flex items-center justify-center gap-2 py-3 bg-white text-brand-primary text-sm font-medium rounded-full shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
              >
                Faire un don <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}