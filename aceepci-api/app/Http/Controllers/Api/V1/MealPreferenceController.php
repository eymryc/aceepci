<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Endpoint;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreMealPreferenceRequest;
use App\Http\Requests\Api\V1\UpdateMealPreferenceRequest;
use App\Http\Resources\Api\V1\MealPreferenceResource;
use App\Http\Responses\ApiResponse;
use App\Models\MealPreference;
use App\Services\MealPreferenceService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

#[Group('Préférences alimentaires', description: 'Paramétrage des préférences de repas (végétarien, sans gluten, etc.)', weight: 10)]
class MealPreferenceController extends Controller
{
    public function __construct(
        private MealPreferenceService $mealPreferenceService
    ) {}

    /** Liste des préférences alimentaires pour les listes déroulantes */
    public function options(): JsonResponse
    {
        return ApiResponse::success(
            MealPreferenceResource::collection($this->mealPreferenceService->list()),
            'List retrieved'
        );
    }

    /** Liste paginée des préférences alimentaires */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        return ApiResponse::success(
            MealPreferenceResource::collection($this->mealPreferenceService->listPaginated($search, $perPage)),
            'List retrieved'
        );
    }

    /** Détail d'une préférence alimentaire */
    public function show(MealPreference $meal_preference): JsonResponse
    {
        $this->authorize('parameters.view');

        return ApiResponse::success(
            new MealPreferenceResource($this->mealPreferenceService->find($meal_preference)),
            'Item retrieved'
        );
    }

    /** Création d'une préférence alimentaire */
    public function store(StoreMealPreferenceRequest $request): JsonResponse
    {
        $item = $this->mealPreferenceService->create($request->validated());

        return ApiResponse::success(new MealPreferenceResource($item), 'Item created', Response::HTTP_CREATED);
    }

    #[Endpoint(title: "Mise à jour d'une préférence alimentaire", operationId: 'mealPreferenceUpdate')]
    public function update(UpdateMealPreferenceRequest $request, MealPreference $meal_preference): JsonResponse
    {
        $item = $this->mealPreferenceService->update($meal_preference, $request->validated());

        return ApiResponse::success(new MealPreferenceResource($item), 'Item updated');
    }

    /** Suppression d'une préférence alimentaire */
    public function destroy(MealPreference $meal_preference): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->mealPreferenceService->delete($meal_preference);

        return ApiResponse::success(null, 'Item deleted');
    }
}
