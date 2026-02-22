<?php

namespace Database\Seeders;

use App\Models\Protocol;
use App\Models\Thread;
use App\Models\User;
use App\Services\TypesenseService;
use Illuminate\Database\Seeder;

class ThreadSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $protocols = Protocol::all();
        $typesense = app(TypesenseService::class);

        Thread::factory(10)->create([
            'user_id' => fn() => $users->random()->id,
            'protocol_id' => fn() => $protocols->random()->id,
        ])->each(function ($thread) use ($typesense) {
            $thread->load('user', 'protocol');
            $typesense->indexThread($thread);
        });
    }
}