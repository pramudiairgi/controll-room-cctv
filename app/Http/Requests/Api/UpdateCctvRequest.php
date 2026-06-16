<?php

namespace App\Http\Requests\Api;

use App\Enums\AssetCategory;
use App\Enums\CctvStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCctvRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'required', 'string', 'max:255'],
            'category' => ['sometimes', 'required', Rule::enum(AssetCategory::class)],
            'location' => ['nullable', 'string'],
            'latitude' => ['sometimes', 'required', 'numeric', 'between:-90,90'],
            'longitude' => ['sometimes', 'required', 'numeric', 'between:-180,180'],
            'youtube_url' => ['nullable', 'string', 'max:255'],
            'status' => ['sometimes', 'required', Rule::enum(CctvStatus::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
