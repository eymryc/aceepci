<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ImportMembersRequest;
use App\Http\Requests\Api\V1\PublicStoreMemberRequest;
use App\Http\Requests\Api\V1\StoreMemberRequest;
use App\Http\Requests\Api\V1\UpdateMemberRequest;
use App\Http\Requests\Api\V1\UpdateMemberStatusRequest;
use App\Http\Resources\Api\V1\MemberResource;
use App\Http\Responses\ApiResponse;
use App\Exports\MembersImportTemplateExport;
use App\Imports\MembersImport;
use App\Models\Member;
use App\Services\MemberService;
use Dedoc\Scramble\Attributes\Group;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Storage;
use Maatwebsite\Excel\Facades\Excel;

/**
 * Contrôleur CRUD pour les membres.
 */
#[Group('Membres', description: 'CRUD des membres et soumission publique depuis le site', weight: 4)]
class MemberController extends Controller
{
    public function __construct(
        private MemberService $memberService
    ) {}

    /** Soumission publique d'une demande membre depuis le site */
    public function publicStore(PublicStoreMemberRequest $request): JsonResponse
    {
        $data = $this->extractPayload($request);
        $member = $this->memberService->create($data, true);

        return ApiResponse::success(new MemberResource($member), 'Demande membre envoyée', Response::HTTP_CREATED);
    }

    /** Liste paginée des membres */
    public function index(Request $request): JsonResponse
    {
        $this->authorize('members.view');

        $search = $request->query('search');
        $perPage = (int) $request->query('per_page', 15);
        $perPage = $perPage > 0 ? min($perPage, 100) : 15;

        $items = $this->memberService->listPaginated($search, $perPage);

        return ApiResponse::success(MemberResource::collection($items), 'List retrieved');
    }

    /** Détail d'un membre */
    public function show(Member $member): JsonResponse
    {
        $this->authorize('members.view');

        return ApiResponse::success(new MemberResource($this->memberService->find($member)), 'Item retrieved');
    }

    /** Création d'un membre par un admin */
    public function store(StoreMemberRequest $request): JsonResponse
    {
        $member = $this->memberService->create($this->extractPayload($request));

        return ApiResponse::success(new MemberResource($member), 'Item created', Response::HTTP_CREATED);
    }

    /** Mise à jour d'un membre */
    public function update(UpdateMemberRequest $request, Member $member): JsonResponse
    {
        $data = $request->validated();

        if ($request->boolean('remove_identity_photo') && $member->identity_photo_url) {
            $this->deleteStoredFile($member->identity_photo_url);
            $data['identity_photo_url'] = null;
        } elseif ($request->hasFile('identity_photo')) {
            $this->deleteStoredFile($member->identity_photo_url);
            $data['identity_photo_url'] = $request->file('identity_photo')->store('members/identity-photos', 'public');
        }

        if ($request->boolean('remove_identity_document') && $member->identity_document_url) {
            $this->deleteStoredFile($member->identity_document_url);
            $data['identity_document_url'] = null;
        } elseif ($request->hasFile('identity_document')) {
            $this->deleteStoredFile($member->identity_document_url);
            $data['identity_document_url'] = $request->file('identity_document')->store('members/documents', 'public');
        }

        if ($request->boolean('remove_pastor_attestation') && $member->pastor_attestation_url) {
            $this->deleteStoredFile($member->pastor_attestation_url);
            $data['pastor_attestation_url'] = null;
        } elseif ($request->hasFile('pastor_attestation')) {
            $this->deleteStoredFile($member->pastor_attestation_url);
            $data['pastor_attestation_url'] = $request->file('pastor_attestation')->store('members/pastor-attestations', 'public');
        }

        if ($request->boolean('remove_student_certificate') && $member->student_certificate_url) {
            $this->deleteStoredFile($member->student_certificate_url);
            $data['student_certificate_url'] = null;
        } elseif ($request->hasFile('student_certificate')) {
            $this->deleteStoredFile($member->student_certificate_url);
            $data['student_certificate_url'] = $request->file('student_certificate')->store('members/student-certificates', 'public');
        }

        unset(
            $data['remove_identity_photo'],
            $data['remove_identity_document'],
            $data['remove_pastor_attestation'],
            $data['remove_student_certificate']
        );

        $member = $this->memberService->update($member, $data);

        return ApiResponse::success(new MemberResource($member), 'Item updated');
    }

    /** Mise à jour du statut d'un membre */
    public function updateStatus(UpdateMemberStatusRequest $request, Member $member): JsonResponse
    {
        $member = $this->memberService->updateStatus($member, $request->validated());

        return ApiResponse::success(new MemberResource($member), 'Statut mis à jour');
    }

    /** Suppression d'un membre */
    public function destroy(Member $member): JsonResponse
    {
        $this->authorize('members.manage');

        $this->memberService->delete($member);

        return ApiResponse::success(null, 'Item deleted');
    }

    /** Télécharger le modèle Excel pour l'import (public) */
    public function importTemplate(): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $filename = 'modele-import-membres-' . date('Y-m-d') . '.xlsx';

        return Excel::download(new MembersImportTemplateExport(), $filename, \Maatwebsite\Excel\Excel::XLSX);
    }

    /** Importer des membres depuis un fichier Excel */
    public function import(ImportMembersRequest $request): JsonResponse
    {
        Excel::import(new MembersImport($this->memberService), $request->file('file'));

        return ApiResponse::success(null, 'Import terminé.');
    }

    /**
     * @param  PublicStoreMemberRequest|StoreMemberRequest  $request
     * @return array<string, mixed>
     */
    private function extractPayload($request): array
    {
        $data = $request->validated();

        if ($request->hasFile('identity_photo')) {
            $data['identity_photo_url'] = $request->file('identity_photo')->store('members/identity-photos', 'public');
        }

        if ($request->hasFile('identity_document')) {
            $data['identity_document_url'] = $request->file('identity_document')->store('members/documents', 'public');
        }

        if ($request->hasFile('pastor_attestation')) {
            $data['pastor_attestation_url'] = $request->file('pastor_attestation')->store('members/pastor-attestations', 'public');
        }

        if ($request->hasFile('student_certificate')) {
            $data['student_certificate_url'] = $request->file('student_certificate')->store('members/student-certificates', 'public');
        }

        unset($data['identity_photo'], $data['identity_document'], $data['pastor_attestation'], $data['student_certificate']);

        return $data;
    }

    private function deleteStoredFile(?string $path): void
    {
        if ($path && ! str_starts_with($path, 'http')) {
            Storage::disk('public')->delete($path);
        }
    }
}
