<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\SaveContactInfoRequest;
use App\Http\Resources\Api\V1\ContactInfoResource;
use App\Http\Responses\ApiResponse;
use App\Services\ContactInfoService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;

#[Group('Informations de contact', description: 'Téléphone, email, adresse, horaires, carte, contacts régionaux (page contact)', weight: 20)]
class ContactInfoController extends Controller
{
    public function __construct(
        private ContactInfoService $service
    ) {}

    /** Récupère les informations pour édition (admin) */
    public function show(): JsonResponse
    {
        $this->authorize('contact.view');

        $record = $this->service->get();

        return ApiResponse::success(new ContactInfoResource($record), 'Informations récupérées');
    }

    /** Récupère les informations pour affichage public (page contact) */
    public function published(): JsonResponse
    {
        $record = $this->service->get();

        return ApiResponse::success(new ContactInfoResource($record), 'Informations récupérées');
    }

    /** Enregistre les informations de contact (admin) */
    public function save(SaveContactInfoRequest $request): JsonResponse
    {
        $record = $this->service->save($request->validated());

        return ApiResponse::success(new ContactInfoResource($record), 'Informations enregistrées');
    }
}
