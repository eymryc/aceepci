<?php

namespace Database\Seeders;

use App\Models\News;
use App\Models\NewsCategory;
use Illuminate\Database\Seeder;

/**
 * Seed des actualités (style ACEEPCI).
 */
class NewsSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(ContentCategorySeeder::class);

        $vie = NewsCategory::firstOrCreate(['name' => 'Vie de l\'association']);
        $spirituel = NewsCategory::firstOrCreate(['name' => 'Spirituel']);
        $evenements = NewsCategory::firstOrCreate(['name' => 'Événements']);

        $items = [
            [
                'slug' => 'lancement-rentree-aceepci-2025',
                'title' => 'Lancement de la rentrée ACEEPCI 2025',
                'news_category_id' => $vie->id,
                'excerpt' => 'Une nouvelle année démarre pour nos cercles : retrouvez les orientations et les temps forts à venir.',
                'content' => "<p>L'ACEEPCI ouvre une nouvelle saison avec tous ses cercles en Côte d'Ivoire. Cette rentrée est l'occasion de renforcer notre devise <strong>Connaître, Aimer, Servir</strong> à travers les cultes, les études bibliques et les actions sur les campus.</p><p>Nous vous invitons à vous joindre à nous pour évangéliser l'école ivoirienne et former les leaders de demain.</p>",
                'author_name' => 'Bureau national ACEEPCI',
                'author_role' => 'Communication',
                'reading_time_minutes' => 2,
            ],
            [
                'slug' => 'mediation-priere-etude-biblique',
                'title' => 'Méditation, prière et étude biblique au cœur de nos cercles',
                'news_category_id' => $spirituel->id,
                'excerpt' => 'Comment nos groupes vivent la prière et l\'étude de la Parole au quotidien.',
                'content' => "<p>Dans chaque cercle ACEEPCI, la méditation et l'étude biblique occupent une place centrale. Nous croyons que <em>Connaître</em> la Parole est le premier pas pour mieux aimer et servir.</p><p>Retrouvez ici des témoignages et des ressources pour approfondir votre vie de prière et votre lecture de la Bible.</p>",
                'author_name' => 'Commission spirituelle',
                'author_role' => 'ACEEPCI',
                'reading_time_minutes' => 3,
            ],
            [
                'slug' => 'camp-biblique-national-2026-annonce',
                'title' => 'Camp Biblique National 2026 : premières infos',
                'news_category_id' => $evenements->id,
                'excerpt' => 'Le prochain Camp Biblique National se profile : thème, lieu et inscriptions à venir.',
                'content' => "<p>Le Camp Biblique National 2026 sera un temps fort pour tous les membres de l'ACEEPCI. Ce rendez-vous annuel permet de se former, de se ressourcer et de servir ensemble selon notre devise.</p><p>Les détails (lieu, dates, thème) seront communiqués prochainement. Restez connectés.</p>",
                'author_name' => 'Bureau national',
                'author_role' => 'Événements',
                'reading_time_minutes' => 2,
            ],
        ];

        foreach ($items as $item) {
            News::firstOrCreate(
                ['slug' => $item['slug']],
                array_merge($item, [
                    'is_published' => true,
                    'published_at' => now(),
                    'comments_enabled' => true,
                    'reactions_enabled' => true,
                    'views_count' => 0,
                ])
            );
        }
    }
}
