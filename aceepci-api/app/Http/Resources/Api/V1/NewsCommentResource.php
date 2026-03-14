<?php

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class NewsCommentResource extends JsonResource
{
    /** @return array<string, mixed> */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'author_name' => $this->author_name,
            'author_avatar_url' => $this->author_avatar_url,
            'content' => $this->content,
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}

