<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ThreadResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'body' => $this->body,
            'tags' => $this->tags ?? [],
            'author' => new UserResource($this->whenLoaded('user')),
            'protocol' => new ProtocolResource($this->whenLoaded('protocol')),
            'upvote_count' => $this->upvote_count,
            'downvote_count' => $this->downvote_count,
            'comment_count' => $this->allComments()->count(),
            'user_vote' => $this->when(
                $request->user(),
                fn() => $this->votes()->where('user_id', $request->user()?->id)->value('type')
            ),
            'comments' => CommentResource::collection($this->whenLoaded('comments')),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}