<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TypesenseService;
use Illuminate\Http\Request;

class SearchController extends Controller
{
    public function __construct(protected TypesenseService $typesense) {}

    public function search(Request $request)
    {
        $request->validate([
            'q' => ['required', 'string', 'min:1'],
            'collection' => ['required', 'in:protocols,threads'],
            'sort_by' => ['nullable', 'string'],
            'page' => ['nullable', 'integer', 'min:1'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:50'],
        ]);

        $sortByMap = [
            'latest' => 'created_at:desc',
            'most_reviewed' => 'review_count:desc',
            'top_rated' => 'average_rating:desc',
            'most_upvoted' => 'upvote_count:desc',
        ];

        $sortBy = $sortByMap[$request->get('sort_by', 'latest')] ?? 'created_at:desc';

        $results = $this->typesense->getClient()
            ->collections[$request->collection]
            ->documents
            ->search([
                'q' => $request->q,
                'query_by' => $request->collection === 'protocols' ? 'title,content,tags' : 'title,body,tags',
                'sort_by' => $sortBy,
                'page' => $request->get('page', 1),
                'per_page' => $request->get('per_page', 10),
            ]);

        return response()->json($results);
    }
}