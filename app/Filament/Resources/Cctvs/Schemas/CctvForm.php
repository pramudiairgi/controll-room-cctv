<?php

namespace App\Filament\Resources\Cctvs\Schemas;

use App\Enums\AssetCategory;
use App\Enums\CctvStatus;
use App\Models\Cctv;
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
                TextInput::make('youtube_url')
                    ->label('YouTube URL')
                    ->placeholder('https://youtube.com/watch?v=...')
                    ->live()
                    ->afterStateUpdated(function ($state, callable $set) {
                        $streamId = Cctv::extractYouTubeId($state);
                        $set('stream_id', $streamId);
                    }),
                TextInput::make('stream_id')
                    ->label('Stream ID')
                    ->disabled()
                    ->dehydrated(),
                Select::make('status')
                    ->options(CctvStatus::class)
                    ->default('online')
                    ->required(),
                Textarea::make('notes')
                    ->columnSpanFull(),
            ]);
    }
}
