"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";

const settingsGroups = [
  {
    title: "Site",
    items: [
      { href: "/admin/settings/contact-info", label: "Informations de contact" },
    ],
  },
  {
    title: "Géographie",
    items: [
      { href: "/admin/settings/cities", label: "Villes" },
      { href: "/admin/settings/districts", label: "Districts" },
    ],
  },
  {
    title: "Membres",
    items: [
      { href: "/admin/settings/member-types", label: "Types de membre" },
      { href: "/admin/settings/member-levels", label: "Niveaux de membre" },
      { href: "/admin/settings/member-statuses", label: "Statuts de membre" },
      { href: "/admin/settings/nationalities", label: "Nationalités" },
      { href: "/admin/settings/families", label: "Familles" },
      { href: "/admin/settings/groups", label: "Groupes" },
    ],
  },
  {
    title: "Académique",
    items: [
      { href: "/admin/settings/academic-years", label: "Années académiques" },
      { href: "/admin/settings/academic-levels", label: "Niveaux académiques" },
      { href: "/admin/settings/training-domains", label: "Domaines de formation" },
    ],
  },
  {
    title: "Service",
    items: [
      { href: "/admin/settings/departments", label: "Départements de service" },
      { href: "/admin/settings/service-domains", label: "Domaines de service" },
      { href: "/admin/settings/knowledge-sources", label: "Sources de connaissance" },
    ],
  },
  {
    title: "Événements",
    items: [
      { href: "/admin/settings/event-categories", label: "Catégories d'événements" },
      { href: "/admin/settings/accommodation-types", label: "Types d'hébergement" },
      { href: "/admin/settings/meal-preferences", label: "Préférences alimentaires" },
      { href: "/admin/settings/workshop-options", label: "Options d'ateliers" },
    ],
  },
  {
    title: "Contenu",
    items: [
      { href: "/admin/settings/news-categories", label: "Catégories d'articles" },
      { href: "/admin/settings/devotional-categories", label: "Catégories de dévotionnels" },
      { href: "/admin/settings/gallery-categories", label: "Catégories de la galerie" },
    ],
  },
  {
    title: "Offres",
    items: [
      { href: "/admin/settings/offer-categories", label: "Catégories d'offres" },
      { href: "/admin/settings/offer-types", label: "Types / Contrats d'offres" },
    ],
  },
];

function getOpenGroupsForPath(pathname: string): Record<string, boolean> {
  const open: Record<string, boolean> = {};
  for (const group of settingsGroups) {
    const hasActive = group.items.some(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/")
    );
    open[group.title] = hasActive;
  }
  return open;
}

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    getOpenGroupsForPath(pathname)
  );

  useEffect(() => {
    setOpenGroups((prev) => {
      const forPath = getOpenGroupsForPath(pathname);
      const changed = settingsGroups.some((g) => prev[g.title] !== forPath[g.title]);
      return changed ? { ...prev, ...forPath } : prev;
    });
  }, [pathname]);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <aside className="lg:w-64 flex-shrink-0">
        <nav className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-slate-50/50">
            <h2 className="text-sm font-semibold text-foreground">Paramétrage</h2>
          </div>
          <div className="divide-y divide-border">
            {settingsGroups.map((group) => {
              const isOpen = openGroups[group.title] ?? false;
              const hasActive = group.items.some(
                (item) => pathname === item.href || pathname.startsWith(item.href + "/")
              );
              return (
                <div key={group.title} className="py-0">
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.title)}
                    className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                      hasActive ? "text-brand-primary bg-brand-primary/5" : "text-foreground hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wider">{group.title}</span>
                    {isOpen ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {isOpen && (
                    <ul className="border-t border-border/50 bg-slate-50/30">
                      {group.items.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                        return (
                          <li key={item.href}>
                            <Link
                              href={item.href}
                              className={`flex items-center justify-between pl-6 pr-4 py-2.5 text-sm transition-colors ${
                                isActive
                                  ? "bg-brand-primary/5 text-brand-primary font-medium border-l-4 border-brand-primary -ml-px pl-[23px]"
                                  : "text-slate-600 hover:bg-slate-50 hover:text-foreground"
                              }`}
                            >
                              {item.label}
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
