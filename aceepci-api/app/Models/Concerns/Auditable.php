<?php

namespace App\Models\Concerns;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * Trait pour les modèles avec colonnes d'audit (created_by, updated_by, deleted_by) et soft deletes.
 */
trait Auditable
{
    use SoftDeletes;

    /**
     * Initialise le trait.
     */
    public static function bootAuditable(): void
    {
        static::creating(function (self $model) {
            if (auth()->check() && in_array('created_by', $model->getFillable())) {
                $model->created_by ??= auth()->id();
            }
        });

        static::updating(function (self $model) {
            if (auth()->check() && in_array('updated_by', $model->getFillable())) {
                $model->updated_by = auth()->id();
            }
        });

        static::deleted(function (self $model) {
            if (auth()->check() && in_array('deleted_by', $model->getFillable()) && ! $model->isForceDeleting()) {
                static::withoutEvents(fn () => $model->newQuery()
                    ->withTrashed()
                    ->where($model->getKeyName(), $model->getKey())
                    ->update(['deleted_by' => auth()->id()]));
            }
        });
    }

    /** Relation : utilisateur ayant créé cet enregistrement */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'created_by');
    }

    /** Relation : utilisateur ayant effectué la dernière mise à jour */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'updated_by');
    }

    /** Relation : utilisateur ayant effectué la suppression (soft delete) */
    public function deleter(): BelongsTo
    {
        return $this->belongsTo(\App\Models\User::class, 'deleted_by');
    }
}
