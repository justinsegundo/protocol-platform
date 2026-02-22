<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCommentRequest;
use App\Http\Resources\CommentResource;
use App\Models\Comment;
use App\Models\Thread;
use App\Services\TypesenseService;

class CommentController extends Controller
{
    public function __construct(protected TypesenseService $typesense) {}

    public function index(Thread $thread)
    {
        $comments = $thread->comments()->with('user', 'replies.user', 'votes', 'replies.votes')->get();

        return CommentResource::collection($comments);
    }

    public function store(StoreCommentRequest $request, Thread $thread)
    {
        $comment = $thread->allComments()->create([
            'user_id' => $request->user()->id,
            'parent_id' => $request->parent_id,
            'body' => $request->body,
        ]);

        $comment->load('user', 'replies', 'votes');
        $this->typesense->indexThread($thread->load('user', 'protocol'));

        return new CommentResource($comment);
    }

    public function update(Request $request, Thread $thread, Comment $comment)
    {
        $this->authorize('update', $comment);

        $data = $request->validate([
            'body' => ['required', 'string'],
        ]);

        $comment->update($data);
        $comment->load('user', 'replies', 'votes');

        return new CommentResource($comment);
    }

    public function destroy(Thread $thread, Comment $comment)
    {
        $this->authorize('delete', $comment);
        $comment->delete();

        $this->typesense->indexThread($thread->load('user', 'protocol'));

        return response()->json(['message' => 'Comment deleted.']);
    }
}