<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Dedoc\Scramble\Attributes\Group;
use App\Http\Requests\Api\V1\StoreMemberStatusRequest;
use App\Http\Requests\Api\V1\UpdateMemberStatusRequest;
use App\Http\Resources\Api\V1\MemberStatusResource;
use App\Http\Responses\ApiResponse;
use App\Models\MemberStatus;
use App\Services\MemberStatusService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Response;

/**
 * Contrôleur CRUD pour les statuts de membre.
 */
#[Group('Statuts de membre', description: 'CRUD des statuts de membre', weight: 10)]
class MemberStatusController extends Controller
{
    public function __construct(
        private MemberStatusService $memberStatusService
    ) {}

    /** Liste pour les select (public, sans pagination) */
    public function options(): JsonResponse
    {
        $items = $this->memberStatusService->list();

        return ApiResponse::success(MemberStatusResource::collection($items), 'List retrieved');
    }

    /** Liste tous les statuts de membre (pagination + recherche) */
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $this->authorize('parameters.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->memberStatusService->listPaginated($search, $perPage);

        return ApiResponse::success(MemberStatusResource::collection($items), 'List retrieved');
    }

    /** Affiche un statut de membre */
    public function show(MemberStatus $member_status): JsonResponse
    {
        $this->authorize('parameters.view');

        $item = $this->memberStatusService->find($member_status);

        return ApiResponse::success(new MemberStatusResource($item), 'Item retrieved');
    }

    /** Crée un nouveau statut de membre */
    public function store(StoreMemberStatusRequest $request): JsonResponse
    {
        $item = $this->memberStatusService->create($request->validated());

        return ApiResponse::success(new MemberStatusResource($item), 'Item created', Response::HTTP_CREATED);
    }

    /** Met à jour un statut de membre */
    public function update(UpdateMemberStatusRequest $request, MemberStatus $member_status): JsonResponse
    {
        $item = $this->memberStatusService->update($member_status, $request->validated());

        return ApiResponse::success(new MemberStatusResource($item), 'Item updated');
    }

    /** Supprime un statut de membre */
    public function destroy(MemberStatus $member_status): JsonResponse
    {
        $this->authorize('parameters.manage');

        $this->memberStatusService->delete($member_status);

        return ApiResponse::success(null, 'Item deleted');
    }
}
