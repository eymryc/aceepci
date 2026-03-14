<?php

namespace App\Models\Concerns;

use App\Services\CodeGeneratorService;

/**
 * Trait pour les modèles de paramètres avec génération automatique de code.
 *
 * Utiliser avec la propriété protégée $codePrefix (ex: 'AY_', 'CT_').
 */
trait HasParameterCode
{
    /**
     * Initialise le trait.
     */
    public static function bootHasParameterCode(): void
    {
        static::creating(function (self $model) {
            if (empty($model->code) && isset($model->codePrefix)) {
                $code = app(CodeGeneratorService::class)->generate(
                    $model->codePrefix,
                    $model->getTable()
                );
                $model->code = $code;
            }
        });
    }
}
