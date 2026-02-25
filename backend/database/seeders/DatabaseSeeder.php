<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;

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

        $this->command->info('Indexing data into Typesense...');
        Artisan::call('typesense:reindex');
        $this->command->info('Typesense indexing complete.');
    }
}