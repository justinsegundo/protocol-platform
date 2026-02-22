<?php

namespace Database\Seeders;

use App\Models\Protocol;
use App\Models\Review;
use App\Models\User;
use App\Services\TypesenseService;
use Illuminate\Database\Seeder;

class ReviewSeeder extends Seeder
{
    public function run(): void
    {
        $protocols = Protocol::all();
        $typesense = app(TypesenseService::class);

        $protocols->each(function ($protocol) use ($typesense) {
            $reviewers = User::inRandomOrder()->limit(rand(2, 5))->get();

            $reviewers->each(function ($user) use ($protocol) {
                Review::factory()->create([
                    'protocol_id' => $protocol->id,
                    'user_id' => $user->id,
                ]);
            });

            $protocol->load('user', 'reviews');
            $typesense->indexProtocol($protocol);
        });
    }
}