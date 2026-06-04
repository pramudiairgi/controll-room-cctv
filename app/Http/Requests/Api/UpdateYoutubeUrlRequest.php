<?php

namespace App\Http\Requests\Api;

use App\Models\Cctv;
use Illuminate\Foundation\Http\FormRequest;

class UpdateYoutubeUrlRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'youtube_url' => ['required', 'string', 'max:255'],
        ];
    }

    protected function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $url = $this->input('youtube_url');
            $id = Cctv::extractYouTubeId($url);

            if ($id === null) {
                $validator->errors()->add('youtube_url', 'Could not extract a valid YouTube ID from the provided URL');
            }
        });
    }
}
