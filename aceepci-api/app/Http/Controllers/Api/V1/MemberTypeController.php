<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreMemberTypeRequest;
use App\Http\Requests\Api\V1\UpdateMemberTypeRequest;
use App\Http\Resources\Api\V1\MemberTypeResource;
use App\Http\Responses\ApiResponse;
use App\Models\MemberType;
use App\Services\MemberTypeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les types de membre.
 */
#[Group('Types de membre', description: 'CRUD des types de membre', weight: 10)]
class MemberTypeController extends Controller
{
    public function __construct(
        private MemberTypeService $memberTypeService
    ) {}

    /** Liste pour les select (public, sans pagination) */
    public function options(): JsonResponse
    {
        $items = $this->memberTypeService->list();

        return ApiResponse::success(MemberTypeResource::collection($items), 'List retrieved');
    }

    /** Liste tous les types de membre (pagination + recherche) */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->memberTypeService->listPaginated($search, $perPage);

        return ApiResponse::success(MemberTypeResource::collection($items), 'List retrieved');
    }

    /** Affiche un type de membre */
    public function show(MemberType $member_type): JsonResponse
    {
        $this->authorize('parameters.view');

        $item = $this->memberTypeService->find($member_type);

        return ApiResponse::success(new MemberTypeResource($item), 'Item retrieved');
    }

    /** Crée un nouveau type de membre */
    public function store(StoreMemberTypeRequest $request): JsonResponse
    {
        $item = $this->memberTypeService->create($request->validated());

        return ApiResponse::success(new MemberTypeResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Met à jour un type de membre */
    public function update(UpdateMemberTypeRequest $request, MemberType $member_type): JsonResponse
    {
        $item = $this->memberTypeService->update($member_type, $request->validated());

        return ApiResponse::success(new MemberTypeResource($item), 'Item updated');
    }

    /** Supprime un type de membre */
    public function destroy(MemberType $member_type): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->memberTypeService->delete($member_type);

        return ApiResponse::success(null, 'Item deleted');
    }
}
