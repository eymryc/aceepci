"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ChevronRight,
  Search,
  Bell,
  User,
} from "lucide-react";

const navGroups = [
  {
    label: "Contenu",
    items: [
      { href: "/admin/news", label: "Actualités", icon: Newspaper },
      { href: "/admin/blog", label: "Blog", icon: FileText },
      { href: "/admin/devotionals", label: "Dévotions", icon: BookOpen },
      { href: "/admin/sermons", label: "Sermons", icon: Mic2 },
      { href: "/admin/verse", label: "Verset du jour", icon: Quote },
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
      { href: "/admin/settings", label: "Paramètres", icon: Settings },
    ],
  },
];

const getPageTitle = (path: string) => {
  const match = navGroups.flatMap((g) => g.items).find((i) => path.startsWith(i.href));
  return match?.label ?? "Admin";
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                      <li key={item.href}>
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
              onClick={() => setSidebarOpen(false)}
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
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/admin" && pathname.startsWith(item.href));
                    return (
                      <li key={item.href}>
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
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 backdrop-blur px-4 sm:px-6 lg:px-8 shadow-sm">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
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
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary to-brand-accent flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Admin</p>
                <p className="text-xs text-muted-foreground">Administrateur</p>
              </div>
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
