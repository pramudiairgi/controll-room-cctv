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

    protected int | string | array $columnSpan = 'full';

    protected function getTableHeading(): string
    {
        return 'CCTV Perlu Perhatian';
    }

    public function table(Table $table): Table
    {
        return $table
            ->searchable()
            ->query(fn () => Cctv::where(function ($q) {
                    $q->whereIn('status', [CctvStatus::Warning, CctvStatus::Offline])
                        ->orWhere('failed_checks_count', '>', 0);
                })
                ->orderBy('failed_checks_count', 'desc')
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
                TextColumn::make('failed_checks_count')
                    ->label('Gagal Cek')
                    ->badge()
                    ->color(fn (int $state): string => match (true) {
                        $state >= 3 => 'danger',
                        $state >= 1 => 'warning',
                        default => 'gray',
                    })
                    ->sortable(),
                TextColumn::make('category')
                    ->badge()
                    ->sortable(),
                TextColumn::make('updated_at')
                    ->label('Terakhir Update')
                    ->since()
                    ->sortable(),
            ])
            ->poll('30s');
    }
}
