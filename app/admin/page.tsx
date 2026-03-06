"use client";

import Link from "next/link";
import {
  Newspaper,
  FileText,
  BookOpen,
  Mic2,
  Briefcase,
  Calendar,
  Users,
  ArrowRight,
  Quote,
  ImageIcon,
  TrendingUp,
  BarChart3,
  Clock,
  Zap,
} from "lucide-react";
import { AdminCard } from "@/components/admin";

const stats = [
  { name: "Actualités", value: "12", href: "/admin/news", icon: Newspaper, color: "from-blue-500 to-blue-600", trend: "+2" },
  { name: "Articles blog", value: "12", href: "/admin/blog", icon: FileText, color: "from-emerald-500 to-emerald-600", trend: "+1" },
  { name: "Dévotions", value: "12", href: "/admin/devotionals", icon: BookOpen, color: "from-amber-500 to-amber-600", trend: "0" },
  { name: "Sermons", value: "12", href: "/admin/sermons", icon: Mic2, color: "from-violet-500 to-violet-600", trend: "+3" },
  { name: "Galerie", value: "8", href: "/admin/gallery", icon: ImageIcon, color: "from-teal-500 to-teal-600", trend: "0" },
  { name: "Offres", value: "8", href: "/admin/offers", icon: Briefcase, color: "from-rose-500 to-rose-600", trend: "+1" },
  { name: "Événements", value: "4", href: "/admin/events", icon: Calendar, color: "from-cyan-500 to-cyan-600", trend: "0" },
  { name: "Adhésions", value: "23", href: "/admin/members", icon: Users, color: "from-brand-primary to-brand-accent", trend: "+5" },
];

const recentActivity = [
  { action: "Nouvelle actualité publiée", item: "Camp Biblique 2026", time: "Il y a 2h", type: "news" },
  { action: "Article blog modifié", item: "Comment Dieu a transformé ma vie", time: "Il y a 5h", type: "blog" },
  { action: "Nouvelle dévotion", item: "La fidélité de Dieu", time: "Hier", type: "devotion" },
  { action: "Inscription événement", item: "Camp Biblique - Jean K.", time: "Hier", type: "event" },
  { action: "Adhésion reçue", item: "Marie Y. - Étudiante", time: "Il y a 2 jours", type: "member" },
];

const quickActions = [
  { label: "Publier une actualité", desc: "Annonce, événement, projet", href: "/admin/news/new", icon: Newspaper, color: "blue" },
  { label: "Écrire un article blog", desc: "Témoignage, réflexion", href: "/admin/blog?action=new", icon: FileText, color: "emerald" },
  { label: "Ajouter une dévotion", desc: "Méditation quotidienne", href: "/admin/devotionals?action=new", icon: BookOpen, color: "amber" },
  { label: "Modifier le verset du jour", desc: "Accueil & Médias", href: "/admin/verse", icon: Quote, color: "sky" },
  { label: "Traiter les adhésions", desc: "23 demandes en attente", href: "/admin/members", icon: Users, color: "brand" },
];

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20",
  emerald: "bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-600 group-hover:bg-amber-500/20",
  sky: "bg-sky-500/10 text-sky-600 group-hover:bg-sky-500/20",
  brand: "bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary/20",
};

export default function AdminDashboardPage() {
  const now = new Date();
  const greeting = now.getHours() < 12 ? "Bonjour" : now.getHours() < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {greeting}, Admin
        </h1>
        <p className="mt-1 text-muted-foreground">
          Voici un aperçu de votre tableau de bord ACEEPCI
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.name}
              href={stat.href}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 hover:shadow-lg hover:shadow-slate-200/50 hover:border-brand-primary/20 transition-all duration-300"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-slate-50 to-transparent rounded-bl-full" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {stat.name}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
                  {stat.trend && stat.trend !== "0" && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs font-medium text-emerald-600">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {stat.trend} ce mois
                    </span>
                  )}
                </div>
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Gérer
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activité récente */}
        <AdminCard padding="none" className="lg:col-span-2">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-foreground">Activité récente</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Dernières actions sur le site
              </p>
            </div>
            <Link
              href="/admin/news"
              className="text-sm font-medium text-brand-primary hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <div className="divide-y divide-border">
            {recentActivity.map((activity, i) => (
              <div
                key={i}
                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.item}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </AdminCard>

        {/* Actions rapides */}
        <AdminCard padding="none">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              Actions rapides
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Accès direct aux tâches courantes
            </p>
          </div>
          <div className="p-4 space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-4 p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50/50 transition-all group"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[action.color]}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm">{action.label}</p>
                    <p className="text-xs text-muted-foreground truncate">{action.desc}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-brand-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                </Link>
              );
            })}
          </div>
        </AdminCard>
      </div>

      {/* Stats chart placeholder */}
      <AdminCard padding="none">
        <div className="px-6 py-4 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-primary" />
              Vue d&apos;ensemble
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Statistiques des 30 derniers jours
            </p>
          </div>
        </div>
        <div className="p-8">
          <div className="h-48 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Graphique à intégrer avec les données réelles
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Vues, publications, adhésions...
              </p>
            </div>
          </div>
        </div>
      </AdminCard>
    </div>
  );
}
