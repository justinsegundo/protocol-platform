<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreThreadRequest;
use App\Http\Resources\ThreadResource;
use App\Models\Thread;
use App\Services\TypesenseService;
use Illuminate\Http\Request;

class ThreadController extends Controller
{
    public function __construct(protected TypesenseService $typesense) {}

    public function index(Request $request)
    {
        $query = Thread::with('user', 'protocol');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('protocol_id')) {
            $query->where('protocol_id', $request->protocol_id);
        }

        if ($request->filled('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }

        $sortBy = $request->get('sort_by', 'latest');

        match ($sortBy) {
            'most_upvoted' => $query->withCount(['votes as upvote_count_sort' => fn($q) => $q->where('type', 'upvote')])->orderByDesc('upvote_count_sort'),
            'most_commented' => $query->withCount('allComments')->orderByDesc('all_comments_count'),
            default => $query->latest(),
        };

        $threads = $query->paginate($request->get('per_page', 10));

        return ThreadResource::collection($threads);
    }

    public function store(StoreThreadRequest $request)
    {
        $thread = $request->user()->threads()->create($request->validated());
        $thread->load('user', 'protocol');

        $this->typesense->indexThread($thread);

        return new ThreadResource($thread);
    }

    public function show(Thread $thread)
    {
        $thread->load('user', 'protocol', 'comments.user', 'comments.votes', 'comments.replies.user', 'comments.replies.votes');

        return new ThreadResource($thread);
    }

    public function update(Request $request, Thread $thread)
    {
        $this->authorize('update', $thread);

        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'body' => ['sometimes', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
        ]);

        $thread->update($data);
        $thread->load('user', 'protocol');

        $this->typesense->indexThread($thread);

        return new ThreadResource($thread);
    }

    public function destroy(Thread $thread)
    {
        $this->authorize('delete', $thread);
        $this->typesense->deleteThread($thread->id);
        $thread->delete();

        return response()->json(['message' => 'Thread deleted.']);
    }
}