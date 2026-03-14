<?php

namespace App\Http\Requests\Api\V1;

use App\Http\Requests\Api\BaseApiRequest;
use Illuminate\Validation\Rule;

/**
 * Validation pour la mise à jour du statut d'un membre.
 */
class UpdateMemberStatusRequest extends BaseApiRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('members.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            'member_status_id' => ['nullable', 'integer', Rule::exists('member_statuses', 'id')],
        ];
    }
}
