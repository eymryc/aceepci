<?php

namespace Database\Seeders;

use App\Models\Sermon;
use Illuminate\Database\Seeder;

/**
 * Seed des sermons (vidéo, audio, texte).
 */
class SermonSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'slug' => 'connaitre-aimer-servir-foundation',
                'title' => 'Connaître, Aimer, Servir : les fondements de notre engagement',
                'type' => 'text',
                'speaker' => 'Pasteur invité',
                'scripture_reference' => 'Matthieu 22.37-39',
                'verse_text' => 'Tu aimeras le Seigneur ton Dieu... Tu aimeras ton prochain comme toi-même.',
                'excerpt' => 'Une méditation sur la devise de l\'ACEEPCI à partir du double commandement d\'amour.',
                'content' => "<p>La devise de l'ACEEPCI — Connaître, Aimer, Servir — s'enracine dans le double commandement que Jésus donne en Matthieu 22. Connaître Dieu et sa Parole nous conduit à l'aimer et à aimer notre prochain, et donc à le servir.</p><p>Ce message pose les bases de notre engagement dans l'école ivoirienne.</p>",
                'reading_time' => '5 min',
                'video_url' => null,
                'audio_url' => null,
            ],
            [
                'slug' => 'evangeliser-lecole-ivoirienne',
                'title' => 'Évangéliser l\'école ivoirienne : mission et témoignage',
                'type' => 'audio',
                'speaker' => 'Responsable national ACEEPCI',
                'scripture_reference' => 'Matthieu 28.19-20',
                'verse_text' => 'Allez, faites de toutes les nations des disciples...',
                'excerpt' => 'Réflexion sur la mission étudiante et la Grande Commission.',
                'content' => "<p>Jésus nous envoie faire des disciples. Dans le contexte de l'école et de l'université, cela signifie vivre notre foi avec authenticité et partager l'Évangile avec nos pairs.</p><p>Ce sermon audio vous encourage à être des témoins sur votre campus.</p>",
                'reading_time' => '35 min',
                'video_url' => null,
                'audio_url' => null,
            ],
            [
                'slug' => 'leadership-et-servir',
                'title' => 'Leadership et servir : former les leaders de demain',
                'type' => 'video',
                'speaker' => 'Intervenant ACEEPCI',
                'scripture_reference' => '2 Timothée 2.15',
                'verse_text' => 'Applique-toi à te présenter devant Dieu comme un ouvrier qui n\'a pas à rougir.',
                'excerpt' => 'Comment se former au leadership selon les Écritures dans le cadre de l\'ACEEPCI.',
                'content' => "<p>L'ACEEPCI a pour vision de former les leaders intellectuels de demain. Ce message explore ce que signifie être un ouvrier approuvé et un leader au service de l'Église et de la société.</p>",
                'reading_time' => '45 min',
                'video_url' => null,
                'audio_url' => null,
            ],
        ];

        foreach ($items as $item) {
            Sermon::firstOrCreate(
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
