<?php

namespace App\Filament\Resources\Cctvs\Schemas;

use App\Enums\AssetCategory;
use App\Enums\CctvStatus;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class CctvForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                Select::make('category')
                    ->options(AssetCategory::class),
                Textarea::make('location')
                    ->columnSpanFull(),
                TextInput::make('latitude')
                    ->required()
                    ->numeric(),
                TextInput::make('longitude')
                    ->required()
                    ->numeric(),
                TextInput::make('stream_id'),
                Select::make('status')
                    ->options(CctvStatus::class)
                    ->default('active')
                    ->required(),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
