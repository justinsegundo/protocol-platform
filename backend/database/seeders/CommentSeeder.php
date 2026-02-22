<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Thread;
use App\Models\User;
use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $threads = Thread::all();

        $threads->each(function ($thread) use ($users) {
            $parentComments = Comment::factory(rand(2, 4))->create([
                'thread_id' => $thread->id,
                'user_id' => fn() => $users->random()->id,
                'parent_id' => null,
            ]);

            $parentComments->each(function ($parent) use ($thread, $users) {
                Comment::factory(rand(1, 2))->create([
                    'thread_id' => $thread->id,
                    'user_id' => fn() => $users->random()->id,
                    'parent_id' => $parent->id,
                ]);
            });
        });
    }
}