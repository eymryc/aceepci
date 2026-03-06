"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

const mockGallery = [
  { id: 1, title: "Formation communautaire", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80", category: "Formation", order: 1 },
  { id: 2, title: "Réunion des membres", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80", category: "Réunion", order: 2 },
  { id: 3, title: "Journée culturelle", image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=600&q=80", category: "Culture", order: 3 },
  { id: 4, title: "Atelier jeunesse", image: "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=600&q=80", category: "Jeunesse", order: 4 },
  { id: 5, title: "Célébration annuelle", image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&q=80", category: "Événement", order: 5 },
  { id: 6, title: "Solidarité & entraide", image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=600&q=80", category: "Solidarité", order: 6 },
  { id: 7, title: "Rencontre interculturelle", image: "https://images.unsplash.com/photo-1526976668912-1a811878dd37?w=600&q=80", category: "Culture", order: 7 },
  { id: 8, title: "Sorties & loisirs", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80", category: "Loisirs", order: 8 },
];

export default function AdminGalleryPage() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground uppercase tracking-tight">
            Galerie média
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Photos affichées sur la page d&apos;accueil et la section galerie
          </p>
        </div>
        <Link
          href="/admin/gallery/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-accent text-white text-sm font-medium rounded-lg hover:opacity-95 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Ajouter une photo
        </Link>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
        <ImageIcon className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-amber-800">
          <p className="font-medium mb-1">Où apparaît la galerie ?</p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-700">
            <li>Page d&apos;accueil — section « Nos activités en images » (PhotoGallerySection)</li>
            <li>Page Actualités — aperçu « Galerie photos & vidéos »</li>
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher par titre ou catégorie..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-lg focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            />
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mockGallery.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:border-brand-primary/30 transition-all bg-muted"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                  <span className="text-[0.65rem] font-medium tracking-wider uppercase text-brand-light mb-1">
                    {item.category}
                  </span>
                  <p className="text-sm font-semibold text-white leading-tight">{item.title}</p>
                </div>
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 bg-white/90 rounded-lg hover:bg-white text-foreground">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-white/90 rounded-lg hover:bg-red-50 text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
