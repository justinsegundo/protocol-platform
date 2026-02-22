<?php

namespace Database\Seeders;

use App\Models\Protocol;
use App\Models\User;
use App\Services\TypesenseService;
use Illuminate\Database\Seeder;

class ProtocolSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $typesense = app(TypesenseService::class);
        $typesense->ensureCollectionsExist();

        Protocol::factory(12)->create([
            'user_id' => fn() => $users->random()->id,
        ])->each(function ($protocol) use ($typesense) {
            $protocol->load('user', 'reviews');
            $typesense->indexProtocol($protocol);
        });
    }
}