<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rules\File;

/**
 * Validation pour l'import de membres depuis un fichier Excel.
 */
class ImportMembersRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('members.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'file' => [
                'required',
                File::types(['xlsx', 'xls', 'csv'])
                    ->max(10 * 1024), // 10 Mo
            ],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            'file.required' => 'Veuillez sélectionner un fichier Excel.',
            'file.types' => 'Le fichier doit être au format Excel (.xlsx, .xls) ou CSV.',
            'file.max' => 'Le fichier ne doit pas dépasser 10 Mo.',
        ];
    }
}
