<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Message envoyé via le formulaire de contact (site public).
 */
class ContactMessage extends Model
{
    protected $table = 'contact_messages';

    /** @var list<string> */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'subject',
        'message',
        'read_at',
    ];

    /** @return array<string, string> */
    protected function casts(): array
    {
        return [
            'read_at' => 'datetime',
        ];
    }
}
