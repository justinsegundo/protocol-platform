<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Thread;
use App\Models\User;
use App\Models\Vote;
use App\Services\TypesenseService;
use Illuminate\Database\Seeder;

class VoteSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::all();
        $threads = Thread::all();
        $comments = Comment::all();
        $typesense = app(TypesenseService::class);

        $threads->each(function ($thread) use ($users, $typesense) {
            $voters = $users->random(rand(2, 6));
            $voters->each(function ($user) use ($thread) {
                Vote::create([
                    'user_id' => $user->id,
                    'votable_id' => $thread->id,
                    'votable_type' => Thread::class,
                    'type' => rand(0, 1) ? 'upvote' : 'downvote',
                ]);
            });

            $thread->load('user', 'protocol');
            $typesense->indexThread($thread);
        });

        $comments->each(function ($comment) use ($users) {
            $voters = $users->random(rand(1, 4));
            $voters->each(function ($user) use ($comment) {
                Vote::firstOrCreate(
                    ['user_id' => $user->id, 'votable_id' => $comment->id, 'votable_type' => Comment::class],
                    ['type' => rand(0, 1) ? 'upvote' : 'downvote']
                );
            });
        });
    }
}