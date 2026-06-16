<?php

namespace App\Filament\Widgets;

use App\Enums\CctvStatus;
use App\Models\Cctv;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Widgets\TableWidget as BaseTableWidget;

class CctvAlertTableWidget extends BaseTableWidget
{
    protected static ?int $sort = 3;

    protected int|string|array $columnSpan = 'full';

    protected function getTableHeading(): string
    {
        return 'Offline CCTV';
    }

    public function table(Table $table): Table
    {
        return $table
            ->searchable()
            ->query(fn () => Cctv::where('status', CctvStatus::Offline)
                ->orderBy('updated_at', 'desc')
            )
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->description(fn (Cctv $record): ?string => $record->location)
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->sortable(),
                TextColumn::make('category')
                    ->badge()
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->label('Last Updated')
                    ->since()
                    ->sortable(),
            ])
            ->poll('30s');
    }
}
