<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreGroupRequest;
use App\Http\Requests\Api\V1\UpdateGroupRequest;
use App\Http\Resources\Api\V1\GroupResource;
use App\Http\Responses\ApiResponse;
use App\Models\Group as GroupModel;
use Dedoc\Scramble\Attributes\Group;
use App\Services\GroupService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les groupes.
 */
#[Group('Groupes', description: 'CRUD des groupes', weight: 10)]
class GroupController extends Controller
{
    public function __construct(
        private GroupService $groupService
    ) {}

    /** Liste pour les select (public, sans pagination). Optionnel : ?family_id= pour filtrer par famille */
    public function options(\Illuminate\Http\Request $request): JsonResponse
    {
        $items = $this->groupService->listForOptions($request->query('family_id'));

        return ApiResponse::success(GroupResource::collection($items), 'List retrieved');
    }

    /** Liste tous les groupes (pagination + recherche) */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->groupService->listPaginated($search, $perPage);

        return ApiResponse::success(GroupResource::collection($items), 'List retrieved');
    }

    /** Affiche un groupe */
    public function show(GroupModel $group): JsonResponse
    {
        $this->authorize('parameters.view');

        $item = $this->groupService->find($group);

        return ApiResponse::success(new GroupResource($item), 'Item retrieved');
    }

    /** Crée un nouveau groupe */
    public function store(StoreGroupRequest $request): JsonResponse
    {
        $item = $this->groupService->create($request->validated());

        return ApiResponse::success(new GroupResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Met à jour un groupe */
    public function update(UpdateGroupRequest $request, GroupModel $group): JsonResponse
    {
        $item = $this->groupService->update($group, $request->validated());

        return ApiResponse::success(new GroupResource($item), 'Item updated');
    }

    /** Supprime un groupe */
    public function destroy(GroupModel $group): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->groupService->delete($group);

        return ApiResponse::success(null, 'Item deleted');
    }
}
