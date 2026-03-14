<?php

namespace App\Services;

use Illuminate\Support\Facades\DB;

/**
 * Service de génération de codes pour les paramètres.
 *
 * Génère des codes au format PREFIX_00001, PREFIX_00002, etc.
 */
class CodeGeneratorService
{
    /** Longueur des chiffres (padding avec des zéros) */
    private int $digitsLength = 5;

    /**
     * Génère un code unique pour une table.
     *
     * @param  string  $prefix  Préfixe du code (ex: AY_, CT_, DS_)
     * @param  string  $table  Nom de la table
     * @return string Code au format PREFIX_00001
     */
    public function generate(string $prefix, string $table): string
    {
        $totalRows = DB::table($table)->count();
        $nextNumber = $totalRows + 1;
        $paddedNumber = str_pad((string) $nextNumber, $this->digitsLength, '0', STR_PAD_LEFT);

        return $prefix . $paddedNumber;
    }

    /**
     * Définit la longueur des chiffres (par défaut 5).
     */
    public function setDigitsLength(int $length): self
    {
        $this->digitsLength = $length;

        return $this;
    }
}
