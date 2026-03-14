<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modèle Offer (offre d'emploi, stage, bourse, bénévolat).
 *
 * Représente une offre publiée par l'ACEEPCI (emploi, stage, bourse, bénévolat).
 */
class Offer extends Model
{
    /** @var list<string> Champs assignables en masse */
    protected $fillable = [
        'title',
        'organization',
        'offer_category_id',
        'offer_type_id',
        'location',
        'deadline',
        'is_published',
        'description',
        'requirements',
        'salary',
        'duration',
        'external_link',
    ];

    /** @return array<string, string> Types de cast des attributs */
    protected function casts(): array
    {
        return [
            'deadline' => 'date',
            'requirements' => 'array',
            'is_published' => 'boolean',
        ];
    }

    /** Relation : catégorie d'offre */
    public function offerCategory(): BelongsTo
    {
        return $this->belongsTo(OfferCategory::class, 'offer_category_id');
    }

    /** Relation : type/contrat d'offre */
    public function offerType(): BelongsTo
    {
        return $this->belongsTo(OfferType::class, 'offer_type_id');
    }
}
