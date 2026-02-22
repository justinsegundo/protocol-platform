<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProtocolRequest;
use App\Http\Requests\UpdateProtocolRequest;
use App\Http\Resources\ProtocolResource;
use App\Models\Protocol;
use App\Services\TypesenseService;
use Illuminate\Http\Request;

class ProtocolController extends Controller
{
    public function __construct(protected TypesenseService $typesense) {}

    public function index(Request $request)
    {
        $query = Protocol::with('user', 'reviews');

        if ($request->filled('search')) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('tag')) {
            $query->whereJsonContains('tags', $request->tag);
        }

        $sortBy = $request->get('sort_by', 'latest');

        match ($sortBy) {
            'most_reviewed' => $query->withCount('reviews')->orderByDesc('reviews_count'),
            'top_rated' => $query->withAvg('reviews', 'rating')->orderByDesc('reviews_avg_rating'),
            default => $query->latest(),
        };

        $protocols = $query->paginate($request->get('per_page', 12));

        return ProtocolResource::collection($protocols);
    }

    public function store(StoreProtocolRequest $request)
    {
        $protocol = $request->user()->protocols()->create($request->validated());
        $protocol->load('user', 'reviews');

        $this->typesense->indexProtocol($protocol);

        return new ProtocolResource($protocol);
    }

    public function show(Protocol $protocol)
    {
        $protocol->load('user', 'reviews.user', 'threads.user');

        return new ProtocolResource($protocol);
    }

    public function update(UpdateProtocolRequest $request, Protocol $protocol)
    {
        $protocol->update($request->validated());
        $protocol->load('user', 'reviews');

        $this->typesense->indexProtocol($protocol);

        return new ProtocolResource($protocol);
    }

    public function destroy(Protocol $protocol)
    {
        $this->authorize('delete', $protocol);
        $this->typesense->deleteProtocol($protocol->id);
        $protocol->delete();

        return response()->json(['message' => 'Protocol deleted.']);
    }
}