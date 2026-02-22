<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'thread_id',
        'parent_id',
        'body',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->with(['user', 'replies', 'votes']);
    }

    public function votes()
    {
        return $this->morphMany(Vote::class, 'votable');
    }

    public function getUpvoteCountAttribute()
    {
        return $this->votes()->where('type', 'upvote')->count();
    }

    public function getDownvoteCountAttribute()
    {
        return $this->votes()->where('type', 'downvote')->count();
    }
}