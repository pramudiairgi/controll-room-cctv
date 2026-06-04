<?php

namespace App\Filament\Resources\Cctvs\Pages;

use App\Filament\Resources\Cctvs\CctvResource;
use App\Models\Cctv;
use Filament\Actions\DeleteAction;
use Filament\Resources\Pages\EditRecord;

class EditCctv extends EditRecord
{
    protected static string $resource = CctvResource::class;

    protected function getHeaderActions(): array
    {
        return [
            DeleteAction::make(),
        ];
    }

    protected function mutateFormDataBeforeSave(array $data): array
    {
        $youtubeUrl = $data['youtube_url'] ?? null;

        if (!empty($youtubeUrl)) {
            $data['stream_id'] = Cctv::extractYouTubeId($youtubeUrl);
        }

        return $data;
    }
}
