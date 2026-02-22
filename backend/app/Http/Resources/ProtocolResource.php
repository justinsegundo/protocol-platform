<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProtocolResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'content' => $this->content,
            'tags' => $this->tags ?? [],
            'category' => $this->category,
            'author' => new UserResource($this->whenLoaded('user')),
            'average_rating' => $this->average_rating,
            'review_count' => $this->review_count,
            'reviews' => ReviewResource::collection($this->whenLoaded('reviews')),
            'threads' => ThreadResource::collection($this->whenLoaded('threads')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}