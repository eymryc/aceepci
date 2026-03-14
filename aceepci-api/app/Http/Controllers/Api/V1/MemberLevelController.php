<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\StoreMemberLevelRequest;
use App\Http\Requests\Api\V1\UpdateMemberLevelRequest;
use App\Http\Resources\Api\V1\MemberLevelResource;
use App\Http\Responses\ApiResponse;
use App\Models\MemberLevel;
use App\Services\MemberLevelService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les niveaux de membre.
 */
#[Group('Niveaux de membre', description: 'CRUD des niveaux de membre', weight: 11)]
class MemberLevelController extends Controller
{
    public function __construct(
        private MemberLevelService $service
    ) {}

    /** Liste pour les select (public, filtrable par member_type_id) */
    public function options(Request $request): JsonResponse
    {
        $memberTypeId = $request->query('member_type_id') ? (int) $request->query('member_type_id') : null;
        $items = $this->service->list($memberTypeId);

        return ApiResponse::success(MemberLevelResource::collection($items), 'List retrieved');
    }

    /** Liste paginée (admin) */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->service->listPaginated($search, $perPage);

        return ApiResponse::success(MemberLevelResource::collection($items), 'List retrieved');
    }

    /** Détail */
    public function show(MemberLevel $member_level): JsonResponse
    {
        $this->authorize('parameters.view');

        return ApiResponse::success(new MemberLevelResource($this->service->find($member_level)), 'Item retrieved');
    }

    /** Création */
    public function store(StoreMemberLevelRequest $request): JsonResponse
    {
        $item = $this->service->create($request->validated());

        return ApiResponse::success(new MemberLevelResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour */
    public function update(UpdateMemberLevelRequest $request, MemberLevel $member_level): JsonResponse
    {
        $item = $this->service->update($member_level, $request->validated());

        return ApiResponse::success(new MemberLevelResource($item), 'Item updated');
    }

    /** Suppression */
    public function destroy(MemberLevel $member_level): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->service->delete($member_level);

        return ApiResponse::success(null, 'Item deleted');
    }
}
