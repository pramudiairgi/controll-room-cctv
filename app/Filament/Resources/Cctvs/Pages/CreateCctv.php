<?php

namespace App\Filament\Resources\Cctvs\Pages;

use App\Filament\Resources\Cctvs\CctvResource;
use App\Models\Cctv;
use Filament\Resources\Pages\CreateRecord;

class CreateCctv extends CreateRecord
{
    protected static string $resource = CctvResource::class;

    protected function mutateFormDataBeforeCreate(array $data): array
    {
        $youtubeUrl = $data['youtube_url'] ?? null;

        if (!empty($youtubeUrl)) {
            $data['stream_id'] = Cctv::extractYouTubeId($youtubeUrl);
        }

        return $data;
    }
}
