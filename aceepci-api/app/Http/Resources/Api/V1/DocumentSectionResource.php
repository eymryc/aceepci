<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * Resource API pour la section Documents officiels.
 */
class DocumentSectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $documents = collect($this->documents ?? [])->map(function (array $doc) {
            $fileUrl = $doc['file_url'] ?? null;

            return [
                'title' => $doc['title'],
                'description' => $doc['description'] ?? null,
                'file_url' => $fileUrl
                    ? (str_starts_with($fileUrl, 'http') ? $fileUrl : asset('storage/' . $fileUrl))
                    : null,
            ];
        })->all();

        return [
            'id' => $this->id,
            'section_label' => $this->section_label,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'documents' => $documents,
            'is_published' => (bool) $this->is_published,
            'published_at' => $this->published_at?->toIso8601String(),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
