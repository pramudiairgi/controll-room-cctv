<?php

namespace App\Http\Requests\Api;

use App\Enums\CctvStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCctvStatusRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(CctvStatus::class)],
        ];
    }
}
