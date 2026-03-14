<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Informations de contact de l'organisation (page contact).
 * Singleton : un seul enregistrement.
 */
class ContactInfo extends Model
{
    protected $table = 'contact_info';

    /** @var list<string> */
    protected $fillable = [
        'phone',
        'email',
        'address',
        'map_embed_url',
        'hours_mon_fri',
        'hours_saturday',
        'hours_sunday',
        'regional_contacts',
        'facebook_url',
        'instagram_url',
        'youtube_url',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'regional_contacts' => 'array',
        ];
    }
}
