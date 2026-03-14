<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\BlogCategory;
use Illuminate\Database\Seeder;

/**
 * Seed des articles de blog (style ACEEPCI).
 */
class BlogSeeder extends Seeder
{
    public function run(): void
    {
        $this->call(BlogCategorySeeder::class);

        $vie = BlogCategory::firstWhere('name', 'Vie de l\'association');
        $reflex = BlogCategory::firstWhere('name', 'Réflexions');
        $temoig = BlogCategory::firstWhere('name', 'Témoignages');
        $enseign = BlogCategory::firstWhere('name', 'Enseignements');
        $evt = BlogCategory::firstWhere('name', 'Événements');

        $items = [
            [
                'slug' => 'bienvenue-sur-le-blog-aceepci',
                'title' => 'Bienvenue sur le blog ACEEPCI',
                'blog_category_id' => $vie?->id,
                'excerpt' => 'Découvrez les actualités, témoignages et réflexions de notre mouvement étudiant et lycéen.',
                'content' => "<p>Ce blog est l'espace où nous partageons la vie de nos cercles, les enseignements qui nous font grandir et les témoignages de ce que Dieu fait parmi les élèves et étudiants.</p><p>Notre devise <strong>Connaître, Aimer, Servir</strong> guide chacune de nos publications. Bonne lecture.</p>",
                'author_name' => 'Équipe ACEEPCI',
                'author_role' => 'Communication',
                'reading_time_minutes' => 2,
            ],
            [
                'slug' => 'connaitre-la-parole-au-quotidien',
                'title' => 'Connaître la Parole au quotidien',
                'blog_category_id' => $reflex?->id,
                'excerpt' => 'Quelques pistes pour intégrer la lecture biblique dans une vie d\'étudiant bien remplie.',
                'content' => "<p>Entre les cours, les partiels et la vie de cercle, trouver du temps pour la Parole peut sembler difficile. Pourtant, c'est le fondement de notre devise : <em>Connaître</em> vient en premier.</p><p>Un verset par jour, un chapitre le matin ou une étude en groupe : l'essentiel est la régularité et le cœur ouvert. Nous vous encourageons à faire de la Bible votre première ressource.</p>",
                'author_name' => 'Commission spirituelle',
                'author_role' => 'ACEEPCI',
                'reading_time_minutes' => 4,
            ],
            [
                'slug' => 'temoinage-venir-au-cercle-a-change-ma-vie',
                'title' => 'Témoignage : Venir au cercle a changé ma vie',
                'blog_category_id' => $temoig?->id,
                'excerpt' => 'Un membre partage comment le cercle ACEEPCI de son lycée l\'a aidé à grandir dans la foi.',
                'content' => "<p>Quand j'ai découvert le cercle ACEEPCI en Seconde, je ne savais pas à quel point cela allait marquer ma vie. Les cultes du midi, les études bibliques et l'amitié des frères et sœurs m'ont fait comprendre ce que signifie <strong>Aimer</strong> Dieu et son prochain.</p><p>Aujourd'hui en Licence, je continue de servir dans mon cercle universitaire. Merci à tous ceux qui m'ont accueilli et encouragé.</p>",
                'author_name' => 'Un membre',
                'author_role' => 'Cercle universitaire',
                'reading_time_minutes' => 3,
            ],
            [
                'slug' => 'servir-dans-son-etablissement',
                'title' => 'Servir dans son établissement : par où commencer ?',
                'blog_category_id' => $enseign?->id,
                'excerpt' => 'Conseils pratiques pour s\'engager concrètement dans son cercle et son école.',
                'content' => "<p><strong>Servir</strong> est le troisième pilier de notre devise. Mais comment servir quand on est étudiant ou lycéen ?</p><p>Commencez par ce qui est à votre portée : accueil, prière, animation d'un temps de partage, communication. Chaque petit pas compte. Les responsables de cercle et le bureau national sont là pour vous orienter selon vos dons et votre disponibilité.</p>",
                'author_name' => 'Bureau national',
                'author_role' => 'ACEEPCI',
                'reading_time_minutes' => 4,
            ],
            [
                'slug' => 'retour-sur-la-conference-leadership-2025',
                'title' => 'Retour sur la conférence Leadership 2025',
                'blog_category_id' => $evt?->id,
                'excerpt' => 'Bilan et moments forts de la dernière conférence nationale sur le leadership chrétien.',
                'content' => "<p>La conférence Leadership a rassemblé des responsables de cercles de toute la Côte d'Ivoire. Au programme : enseignements sur le leadership selon la Bible, ateliers pratiques et temps de communion.</p><p>Merci à tous les participants et aux intervenants. Rendez-vous l'année prochaine pour une nouvelle édition.</p>",
                'author_name' => 'Équipe événements',
                'author_role' => 'ACEEPCI',
                'reading_time_minutes' => 3,
            ],
            [
                'slug' => 'priere-et-intercession-dans-les-cercles',
                'title' => 'Prière et intercession dans les cercles',
                'blog_category_id' => $reflex?->id,
                'excerpt' => 'L\'importance de la prière collective et de l\'intercession pour l\'école ivoirienne.',
                'content' => "<p>Nos cercles ne vivent pas seulement d'études bibliques et de cultes : la prière et l'intercession en sont le souffle. Prier pour nos camarades, nos professeurs et notre nation fait partie de notre mission.</p><p>Nous vous invitons à rejoindre les temps de prière dans votre cercle et à porter l'école ivoirienne dans votre cœur.</p>",
                'author_name' => 'Commission prière',
                'author_role' => 'ACEEPCI',
                'reading_time_minutes' => 3,
            ],
        ];

        foreach ($items as $item) {
            Blog::firstOrCreate(
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
