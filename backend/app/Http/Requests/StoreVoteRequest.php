<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVoteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'votable_type' => ['required', 'in:thread,comment'],
            'votable_id' => ['required', 'integer'],
            'type' => ['required', 'in:upvote,downvote'],
        ];
    }
}