<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ProtocolSeeder::class,
            ThreadSeeder::class,
            CommentSeeder::class,
            ReviewSeeder::class,
            VoteSeeder::class,
        ]);
    }
}