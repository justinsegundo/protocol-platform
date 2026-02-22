<?php

namespace App\Providers;

use App\Models\Comment;
use App\Models\Protocol;
use App\Models\Thread;
use App\Policies\CommentPolicy;
use App\Policies\ProtocolPolicy;
use App\Policies\ThreadPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Protocol::class => ProtocolPolicy::class,
        Thread::class => ThreadPolicy::class,
        Comment::class => CommentPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}