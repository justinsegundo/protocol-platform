<?php

namespace App\Policies;

use App\Models\Protocol;
use App\Models\User;

class ProtocolPolicy
{
    public function update(User $user, Protocol $protocol): bool
    {
        return $user->id === $protocol->user_id;
    }

    public function delete(User $user, Protocol $protocol): bool
    {
        return $user->id === $protocol->user_id;
    }
}