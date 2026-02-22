<?php

namespace App\Services;

use Typesense\Client;

class TypesenseService
{
    protected ?Client $client = null;

    public function getClient(): Client
    {
        if ($this->client === null) {
            $this->client = new Client([
                'api_key' => config('services.typesense.api_key'),
                'nodes' => [
                    [
                        'host' => config('services.typesense.host'),
                        'port' => config('services.typesense.port'),
                        'protocol' => config('services.typesense.protocol'),
                    ],
                ],
                'connection_timeout_seconds' => 5,
                'verify' => app()->isProduction(),
            ]);
        }

        return $this->client;
    }
    public function ensureCollectionsExist(): void
    {
        $this->dropCollectionIfExists('protocols');
        $this->dropCollectionIfExists('threads');
        $this->ensureProtocolsCollection();
        $this->ensureThreadsCollection();
    }

    private function dropCollectionIfExists(string $name): void
    {
        try {
            $this->getClient()->collections[$name]->delete();
        } catch (\Exception $e) {
        }
    }

    private function ensureProtocolsCollection(): void
    {
        try {
            $this->getClient()->collections['protocols']->retrieve();
        } catch (\Typesense\Exceptions\ObjectNotFound $e) {
            $this->getClient()->collections->create([
                'name' => 'protocols',
                'fields' => [
                    ['name' => 'id', 'type' => 'string'],
                    ['name' => 'title', 'type' => 'string'],
                    ['name' => 'content', 'type' => 'string'],
                    ['name' => 'tags', 'type' => 'string[]', 'optional' => true],
                    ['name' => 'category', 'type' => 'string', 'optional' => true],
                    ['name' => 'author', 'type' => 'string'],
                    ['name' => 'average_rating', 'type' => 'float'],
                    ['name' => 'review_count', 'type' => 'int32'],
                    ['name' => 'upvote_count', 'type' => 'int32'],
                    ['name' => 'created_at', 'type' => 'int64'],
                ],
                'default_sorting_field' => 'created_at',
            ]);
        }
    }

    private function ensureThreadsCollection(): void
    {
        try {
            $this->getClient()->collections['threads']->retrieve();
        } catch (\Typesense\Exceptions\ObjectNotFound $e) {
            $this->getClient()->collections->create([
                'name' => 'threads',
                'fields' => [
                    ['name' => 'id', 'type' => 'string'],
                    ['name' => 'title', 'type' => 'string'],
                    ['name' => 'body', 'type' => 'string'],
                    ['name' => 'tags', 'type' => 'string[]', 'optional' => true],
                    ['name' => 'author', 'type' => 'string'],
                    ['name' => 'protocol_title', 'type' => 'string', 'optional' => true],
                    ['name' => 'upvote_count', 'type' => 'int32'],
                    ['name' => 'comment_count', 'type' => 'int32'],
                    ['name' => 'created_at', 'type' => 'int64'],
                ],
                'default_sorting_field' => 'created_at',
            ]);
        }
    }

    public function indexProtocol($protocol): void
    {
        $this->getClient()->collections['protocols']->documents->upsert(
            $this->buildProtocolDocument($protocol)
        );
    }

    public function deleteProtocol(int $id): void
    {
        try {
            $this->getClient()->collections['protocols']->documents[(string) $id]->delete();
        } catch (\Exception $e) {
        }
    }

    public function indexThread($thread): void
    {
        $this->getClient()->collections['threads']->documents->upsert(
            $this->buildThreadDocument($thread)
        );
    }

    public function deleteThread(int $id): void
    {
        try {
            $this->getClient()->collections['threads']->documents[(string) $id]->delete();
        } catch (\Exception $e) {
        }
    }

    private function buildProtocolDocument($protocol): array
    {
        return [
            'id' => (string) $protocol->id,
            'title' => $protocol->title,
            'content' => strip_tags($protocol->content),
            'tags' => $protocol->tags ?? [],
            'category' => $protocol->category ?? '',
            'author' => $protocol->user->name,
            'average_rating' => (float) $protocol->average_rating,
            'review_count' => (int) $protocol->review_count,
            'upvote_count' => 0,
            'created_at' => $protocol->created_at->timestamp,
        ];
    }

    private function buildThreadDocument($thread): array
    {
        return [
            'id' => (string) $thread->id,
            'title' => $thread->title,
            'body' => strip_tags($thread->body),
            'tags' => $thread->tags ?? [],
            'author' => $thread->user->name,
            'protocol_title' => $thread->protocol?->title ?? '',
            'upvote_count' => (int) $thread->upvote_count,
            'comment_count' => (int) $thread->allComments()->count(),
            'created_at' => $thread->created_at->timestamp,
        ];
    }

    public function reindexAll(): void
    {
        $this->reindexProtocols();
        $this->reindexThreads();
    }

    private function reindexProtocols(): void
    {
        \App\Models\Protocol::with('user', 'reviews')->chunk(100, function ($protocols) {
            foreach ($protocols as $protocol) {
                $this->indexProtocol($protocol);
            }
        });
    }

    private function reindexThreads(): void
    {
        \App\Models\Thread::with('user', 'protocol')->chunk(100, function ($threads) {
            foreach ($threads as $thread) {
                $this->indexThread($thread);
            }
        });
    }
}