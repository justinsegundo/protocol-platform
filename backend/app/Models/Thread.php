<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Thread extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'protocol_id',
        'title',
        'body',
        'tags',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function protocol()
    {
        return $this->belongsTo(Protocol::class);
    }

    public function comments()
    {
        return $this->hasMany(Comment::class)->whereNull('parent_id')->with('replies');
    }

    public function allComments()
    {
        return $this->hasMany(Comment::class);
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