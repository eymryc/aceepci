"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Newspaper,
  FileText,
  BookOpen,
  Mic2,
  Briefcase,
  Calendar,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  Quote,
  ImageIcon,
  Info,
  ChevronRight,
  Search,
  Bell,
  User,
  ChevronDown,
} from "lucide-react";

const settingsSubItems = [
  { href: "/admin/settings/departments", label: "Départements de service" },
  { href: "/admin/settings/cities", label: "Villes" },
  { href: "/admin/settings/districts", label: "Districts" },
  { href: "/admin/settings/member-types", label: "Types de membre" },
  { href: "/admin/settings/member-levels", label: "Niveaux de membre" },
  { href: "/admin/settings/nationalities", label: "Nationalités" },
  { href: "/admin/settings/academic-years", label: "Années académiques" },
  { href: "/admin/settings/academic-levels", label: "Niveaux académiques" },
  { href: "/admin/settings/training-domains", label: "Domaines de formation" },
  { href: "/admin/settings/service-domains", label: "Domaines de service" },
  { href: "/admin/settings/knowledge-sources", label: "Sources de connaissance" },
  { href: "/admin/settings/member-statuses", label: "Statuts de membre" },
  { href: "/admin/settings/families", label: "Familles" },
  { href: "/admin/settings/groups", label: "Groupes" },
];

const aboutSubItems = [
  { href: "/admin/about/histoire", label: "Histoire" },
  { href: "/admin/about/mot-du-president", label: "Mot du président" },
  { href: "/admin/about/mission", label: "Notre mission" },
  { href: "/admin/about/vision", label: "Notre vision" },
  { href: "/admin/about/devise", label: "Notre devise" },
  { href: "/admin/about/documents", label: "Nos documents" },
  { href: "/admin/about/organisation", label: "Notre organisation" },
];

const navGroups = [
  {
    label: "Contenu",
    items: [
      { href: "/admin/hero-slides", label: "Slides bannière", icon: ImageIcon },
      { href: "/admin/verse", label: "Verset du jour", icon: Quote },
      { href: "/admin/about", label: "À propos", icon: Info, subItems: aboutSubItems },
      { href: "/admin/news", label: "Actualités", icon: Newspaper },
      { href: "/admin/blog", label: "Blog", icon: FileText },
      { href: "/admin/devotionals", label: "Dévotions", icon: BookOpen },
      { href: "/admin/sermons", label: "Sermons", icon: Mic2 },
      { href: "/admin/gallery", label: "Galerie média", icon: ImageIcon },
    ],
  },
  {
    label: "Communauté",
    items: [
      { href: "/admin/offers", label: "Offres", icon: Briefcase },
      { href: "/admin/events", label: "Événements", icon: Calendar },
      { href: "/admin/members", label: "Adhésions", icon: Users },
    ],
  },
  {
    label: "Système",
    items: [
      { href: "/admin/settings", label: "Paramètres", icon: Settings, subItems: settingsSubItems },
    ],
  },
];

const getPageTitle = (path: string) => {
  const subMatch = settingsSubItems.find((s) => path === s.href || path.startsWith(s.href + "/"));
  if (subMatch) return subMatch.label;
  const aboutMatch = aboutSubItems.find((s) => path === s.href || path.startsWith(s.href + "/"));
  if (aboutMatch) return aboutMatch.label;
  const match = navGroups.flatMap((g) => g.items).find((i) => path.startsWith(i.href));
  return match?.label ?? "Admin";
};

const formatRole = (role: string | undefined) => {
  if (!role) return "Administrateur";
  const r = role.toLowerCase();
  if (r.includes("admin")) return "Administrateur";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    settings: false,
    about: false,
  });
  const { user, logout, isAuthenticated, isLoading } = useAuth();

  const getMenuKey = (href: string): "settings" | "about" | null => {
    if (href === "/admin/settings") return "settings";
    if (href === "/admin/about") return "about";
    return null;
  };

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (!isLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f1f5f9]">
        <div className="animate-pulse text-muted-foreground">Redirection vers la connexion...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col overflow-y-auto bg-[#0f172a] border-r border-slate-700/50">
          {/* Logo */}
          <div className="flex h-20 shrink-0 items-center gap-3 px-6 border-b border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-serif text-lg font-bold text-white block">ACEEPCI</span>
              <span className="text-[0.65rem] text-slate-400 tracking-wider uppercase">Administration</span>
            </div>
          </div>

          {/* Nav groups */}
          <nav className="flex-1 px-4 py-6 space-y-6">
            <Link
              href="/admin"
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                pathname === "/admin"
                  ? "bg-gradient-to-r from-brand-primary/30 to-brand-accent/20 text-white border-l-4 border-amber-400"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Tableau de bord
            </Link>

            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-4 mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const hasSubItems = "subItems" in item && item.subItems && item.subItems.length > 0;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/admin" && pathname.startsWith(item.href));
                    const menuKey = getMenuKey(item.href);
                    const expanded = menuKey ? expandedMenus[menuKey] || pathname.startsWith(item.href) : false;
                    return (
                      <li key={item.href}>
                        {hasSubItems ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                menuKey &&
                                setExpandedMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }))
                              }
                              className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                                isActive
                                  ? "bg-white/10 text-white border-l-4 border-amber-400 -ml-0.5 pl-4"
                                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 flex-shrink-0" />
                                {item.label}
                              </div>
                              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${expanded ? "rotate-180" : ""}`} />
                            </button>
                            {expanded && (
                              <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-600/50 pl-3">
                                {(item as { subItems: { href: string; label: string }[] }).subItems.map((sub) => (
                                  <li key={sub.href}>
                                    <Link
                                      href={sub.href}
                                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-all ${
                                        pathname === sub.href
                                          ? "bg-white/10 text-white font-medium"
                                          : "text-slate-500 hover:bg-white/5 hover:text-slate-200"
                                      }`}
                                    >
                                      {sub.label}
                                      <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                              isActive
                                ? "bg-white/10 text-white border-l-4 border-amber-400 -ml-0.5 pl-4"
                                : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                            }`}
                          >
                            <Icon className="w-4 h-4 flex-shrink-0" />
                            {item.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="border-t border-slate-700/50 p-4 space-y-1">
            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour au site
            </Link>
            <button
              type="button"
              onClick={() => logout()}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0f172a] transform transition-transform lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="flex h-20 items-center justify-between px-6 border-b border-slate-700/50">
            <span className="font-serif text-lg font-bold text-white">Admin ACEEPCI</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer le menu"
              className="p-2 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-6">
            <Link
              href="/admin"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5"
            >
              <LayoutDashboard className="w-5 h-5" />
              Tableau de bord
            </Link>
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="px-4 mb-2 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-500">
                  {group.label}
                </p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const hasSubItems = "subItems" in item && item.subItems && item.subItems.length > 0;
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/admin" && pathname.startsWith(item.href));
                    const menuKey = getMenuKey(item.href);
                    const expanded = menuKey ? expandedMenus[menuKey] || pathname.startsWith(item.href) : false;
                    return (
                      <li key={item.href}>
                        {hasSubItems ? (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                menuKey &&
                                setExpandedMenus((prev) => ({ ...prev, [menuKey]: !prev[menuKey] }))
                              }
                              className={`flex w-full items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm ${
                                isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4" />
                                {item.label}
                              </div>
                              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`} />
                            </button>
                            {expanded && (
                              <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-600/50 pl-3">
                                {(item as { subItems: { href: string; label: string }[] }).subItems.map((sub) => (
                                  <li key={sub.href}>
                                    <Link
                                      href={sub.href}
                                      onClick={() => setSidebarOpen(false)}
                                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm ${
                                        pathname === sub.href ? "bg-white/10 text-white font-medium" : "text-slate-500 hover:text-white"
                                      }`}
                                    >
                                      {sub.label}
                                      <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </>
                        ) : (
                          <Link
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm ${
                              isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {item.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="border-t border-slate-700/50 p-4 space-y-1">
            <Link
              href="/"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Retour au site
            </Link>
            <button
              type="button"
              onClick={() => { logout(); setSidebarOpen(false); }}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 backdrop-blur px-4 sm:px-6 lg:px-8 shadow-sm">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
            className="lg:hidden p-2 -m-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-600 min-w-0">
            <Link href="/admin" className="hover:text-brand-primary font-medium truncate">
              Admin
            </Link>
            {pathname !== "/admin" && (
              <>
                <ChevronRight className="w-4 h-4 flex-shrink-0 text-slate-400" />
                <span className="font-medium text-foreground truncate">
                  {getPageTitle(pathname)}
                </span>
              </>
            )}
          </div>

          <div className="flex-1" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Rechercher"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              type="button"
              className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
            </button>
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-primary hover:bg-slate-50 rounded-lg transition-colors"
            >
              Voir le site
            </Link>
            <div className="hidden md:block relative pl-4 border-l border-slate-200">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 p-1.5 -m-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-foreground">
                    {user?.firstname ?? user?.username ?? "Admin"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRole(user?.roles?.[0])}
                  </p>
                </div>
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenuOpen(false)}
                    aria-hidden
                  />
                  <div className="absolute right-0 top-full mt-1 pt-1 w-56 z-50">
                    <div className="bg-white rounded-lg shadow-lg border border-slate-200 py-2 overflow-hidden">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user?.fullname ?? user?.firstname ?? "Admin"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        href="/admin/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Profil
                      </Link>
                      <button
                        type="button"
                        onClick={() => { logout(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-4rem)]">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
