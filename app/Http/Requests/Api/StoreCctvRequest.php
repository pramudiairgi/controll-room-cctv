<?php

namespace App\Http\Requests\Api;

use App\Enums\AssetCategory;
use App\Enums\CctvStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreCctvRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', Rule::enum(AssetCategory::class)],
            'location' => ['nullable', 'string'],
            'latitude' => ['required', 'numeric', 'between:-90,90'],
            'longitude' => ['required', 'numeric', 'between:-180,180'],
            'youtube_url' => ['nullable', 'string', 'max:255'],
            'status' => ['required', Rule::enum(CctvStatus::class)],
            'notes' => ['nullable', 'string'],
        ];
    }
}
