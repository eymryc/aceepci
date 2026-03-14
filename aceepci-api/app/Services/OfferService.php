<?php

namespace App\Services;

use App\Models\Offer;
use App\Models\OfferCategory;
use App\Models\OfferType;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Service de gestion des offres.
 */
class OfferService
{
    public function listPaginated(
        ?string $search = null,
        ?int $categoryId = null,
        ?int $typeId = null,
        int $perPage = 15,
        bool $includeExpired = false,
        bool $includeUnpublished = false,
    ): LengthAwarePaginator
    {
        $query = Offer::query()
            ->with(['offerCategory', 'offerType'])
            ->orderBy('deadline', 'desc');

        if ($search && trim($search) !== '') {
            $term = '%' . trim($search) . '%';
            $likeOp = \Illuminate\Support\Facades\DB::connection()->getDriverName() === 'pgsql' ? 'ilike' : 'like';
            $query->where(function ($q) use ($term, $likeOp) {
                $q->where('title', $likeOp, $term)
                    ->orWhere('organization', $likeOp, $term)
                    ->orWhere('location', $likeOp, $term)
                    ->orWhere('description', $likeOp, $term);
            });
        }

        if ($categoryId) {
            $query->where('offer_category_id', $categoryId);
        }

        if ($typeId) {
            $query->where('offer_type_id', $typeId);
        }

        if (! $includeUnpublished) {
            $query->where('is_published', true);
        }

        if (! $includeExpired) {
            $query->whereDate('deadline', '>=', now()->toDateString());
        }

        return $query->paginate(min($perPage, 100));
    }

    public function find(Offer $offer): Offer
    {
        return $offer->load(['offerCategory', 'offerType']);
    }

    public function create(array $data): Offer
    {
        $data = $this->resolveFallbackIds($data);
        $offer = Offer::create($data);

        return $this->find($offer);
    }

    public function update(Offer $offer, array $data): Offer
    {
        $data = $this->resolveFallbackIds($data);
        $offer->update($data);

        return $this->find($offer);
    }

    public function delete(Offer $offer): void
    {
        $offer->delete();
    }

    public function publish(Offer $offer): Offer
    {
        $offer->forceFill(['is_published' => true])->save();

        return $this->find($offer);
    }

    public function unpublish(Offer $offer): Offer
    {
        $offer->forceFill(['is_published' => false])->save();

        return $this->find($offer);
    }

    /**
     * Fallback rétrocompatibilité : résout category/type (string) en offer_category_id/offer_type_id.
     */
    private function resolveFallbackIds(array $data): array
    {
        if (empty($data['offer_category_id']) && ! empty($data['category'] ?? null)) {
            $code = strtoupper(str_replace(['é', 'è', 'ê'], 'e', $data['category']));
            $category = OfferCategory::query()->where('code', $code)->orWhere('name', $data['category'])->first();
            if ($category) {
                $data['offer_category_id'] = $category->id;
            }
            unset($data['category']);
        }

        if (empty($data['offer_type_id']) && ! empty($data['type'] ?? null)) {
            $code = strtoupper(str_replace(['é', 'è', 'ê'], 'e', $data['type']));
            $type = OfferType::query()->where('code', $code)->orWhere('name', $data['type'])->first();
            if ($type) {
                $data['offer_type_id'] = $type->id;
            }
            unset($data['type']);
        }

        unset($data['category'], $data['type']);

        return $data;
    }
}
