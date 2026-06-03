<?php

namespace App\Filament\Resources\Cctvs\Pages;

use App\Filament\Resources\Cctvs\CctvResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListCctvs extends ListRecords
{
    protected static string $resource = CctvResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
