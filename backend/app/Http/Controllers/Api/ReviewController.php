<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Protocol;
use App\Services\TypesenseService;

class ReviewController extends Controller
{
    public function __construct(protected TypesenseService $typesense) {}

    public function store(StoreReviewRequest $request, Protocol $protocol)
    {
        $existing = $protocol->reviews()->where('user_id', $request->user()->id)->first();

        if ($existing) {
            return response()->json(['message' => 'You have already reviewed this protocol.'], 422);
        }

        $review = $protocol->reviews()->create([
            'user_id' => $request->user()->id,
            'rating' => $request->rating,
            'feedback' => $request->feedback,
        ]);

        $review->load('user');
        $protocol->load('user', 'reviews');
        $this->typesense->indexProtocol($protocol);

        return new ReviewResource($review);
    }

    public function update(StoreReviewRequest $request, Protocol $protocol)
    {
        $review = $protocol->reviews()->where('user_id', $request->user()->id)->firstOrFail();
        $review->update($request->validated());
        $review->load('user');

        $protocol->load('user', 'reviews');
        $this->typesense->indexProtocol($protocol);

        return new ReviewResource($review);
    }

    public function destroy(Protocol $protocol)
    {
        $review = $protocol->reviews()->where('user_id', request()->user()->id)->firstOrFail();
        $review->delete();

        $protocol->load('user', 'reviews');
        $this->typesense->indexProtocol($protocol);

        return response()->json(['message' => 'Review deleted.']);
    }
}