<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CommentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'body' => $this->body,
            'parent_id' => $this->parent_id,
            'author' => new UserResource($this->whenLoaded('user')),
            'upvote_count' => $this->upvote_count,
            'downvote_count' => $this->downvote_count,
            'user_vote' => $this->when(
                $request->user(),
                fn() => $this->votes()->where('user_id', $request->user()?->id)->value('type')
            ),
            'replies' => CommentResource::collection($this->whenLoaded('replies')),
            'created_at' => $this->created_at->toISOString(),
        ];
    }
}