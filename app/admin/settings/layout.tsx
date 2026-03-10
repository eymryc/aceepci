"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

const settingsSubItems = [
  { href: "/admin/settings/departments", label: "Départements de service" },
  { href: "/admin/settings/cities", label: "Villes" },
  { href: "/admin/settings/districts", label: "Districts" },
  { href: "/admin/settings/member-types", label: "Types de membre" },
  { href: "/admin/settings/academic-years", label: "Années académiques" },
  { href: "/admin/settings/training-domains", label: "Domaines de formation" },
  { href: "/admin/settings/service-domains", label: "Domaines de service" },
  { href: "/admin/settings/member-statuses", label: "Statuts de membre" },
  { href: "/admin/settings/families", label: "Familles" },
  { href: "/admin/settings/groups", label: "Groupes" },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <aside className="lg:w-64 flex-shrink-0">
        <nav className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-border bg-slate-50/50">
            <h2 className="text-sm font-semibold text-foreground">Paramétrage</h2>
          </div>
          <ul className="divide-y divide-border">
            {settingsSubItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3 text-sm transition-colors ${
                      isActive
                        ? "bg-brand-primary/5 text-brand-primary font-medium border-l-4 border-brand-primary -ml-px pl-[15px]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-foreground"
                    }`}
                  >
                    {item.label}
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
