<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class YoutubeLiveService
{
    public function check(array $videoIds): array
    {
        if (empty($videoIds)) {
            return [];
        }

        $chunks = array_chunk($videoIds, 50);
        $results = [];

        foreach ($chunks as $chunk) {
            $response = Http::get('https://www.googleapis.com/youtube/v3/videos', [
                'part' => 'liveStreamingDetails',
                'id' => implode(',', $chunk),
                'key' => config('services.youtube.api_key'),
            ]);

            if (! $response->successful()) {
                continue;
            }

            foreach ($response->json('items', []) as $item) {
                $id = $item['id'];
                $details = $item['liveStreamingDetails'] ?? null;
                $results[$id] = $details && ! isset($details['actualEndTime']);
            }
        }

        return $results;
    }
}
