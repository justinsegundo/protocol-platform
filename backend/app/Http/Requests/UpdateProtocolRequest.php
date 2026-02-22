<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProtocolRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->id === $this->route('protocol')->user_id;
    }

    public function rules(): array
    {
        return [
            'title' => ['sometimes', 'string', 'max:255'],
            'content' => ['sometimes', 'string'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string', 'max:50'],
            'category' => ['nullable', 'string', 'max:100'],
        ];
    }
}