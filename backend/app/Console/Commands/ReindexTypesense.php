<?php

namespace App\Console\Commands;

use App\Services\TypesenseService;
use Illuminate\Console\Command;

class ReindexTypesense extends Command
{
    protected $signature = 'typesense:reindex';
    protected $description = 'Reindex all protocols and threads to Typesense';

    public function __construct(protected TypesenseService $typesense) {
        parent::__construct();
    }

    public function handle(): void
    {
        $this->info('Ensuring collections exist...');
        $this->typesense->ensureCollectionsExist();

        $this->info('Reindexing protocols...');
        $this->info('Reindexing threads...');
        $this->typesense->reindexAll();

        $this->info('Reindex complete.');
    }
}