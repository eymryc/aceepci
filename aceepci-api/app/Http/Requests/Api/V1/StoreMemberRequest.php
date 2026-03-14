<?php

namespace App\Http\Requests\Api\V1;

/**
 * Requête admin pour créer un membre.
 */
class StoreMemberRequest extends PublicStoreMemberRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('members.manage') ?? false;
    }

    public function rules(): array
    {
        return [
            ...parent::rules(),
            'member_status_id' => ['nullable', 'integer', \Illuminate\Validation\Rule::exists('member_statuses', 'id')],
        ];
    }
}
