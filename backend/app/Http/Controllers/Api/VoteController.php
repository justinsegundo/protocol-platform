<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVoteRequest;
use App\Models\Comment;
use App\Models\Thread;
use App\Services\TypesenseService;

class VoteController extends Controller
{
    public function __construct(protected TypesenseService $typesense) {}

    public function vote(StoreVoteRequest $request)
    {
        $votable = $this->resolveVotable($request->votable_type, $request->votable_id);

        if (!$votable) {
            return response()->json(['message' => 'Votable not found.'], 404);
        }

        $existingVote = $votable->votes()->where('user_id', $request->user()->id)->first();

        if ($existingVote) {
            if ($existingVote->type === $request->type) {
                $existingVote->delete();
                $message = 'Vote removed.';
            } else {
                $existingVote->update(['type' => $request->type]);
                $message = 'Vote updated.';
            }
        } else {
            $votable->votes()->create([
                'user_id' => $request->user()->id,
                'type' => $request->type,
            ]);
            $message = 'Vote recorded.';
        }

        if ($votable instanceof Thread) {
            $votable->load('user', 'protocol');
            $this->typesense->indexThread($votable);
        }

        return response()->json([
            'message' => $message,
            'upvote_count' => $votable->fresh()->upvote_count,
            'downvote_count' => $votable->fresh()->downvote_count,
            'user_vote' => $votable->fresh()->votes()->where('user_id', $request->user()->id)->value('type'),
        ]);
    }

    private function resolveVotable(string $type, int $id)
    {
        return match ($type) {
            'thread' => Thread::find($id),
            'comment' => Comment::find($id),
            default => null,
        };
    }
}