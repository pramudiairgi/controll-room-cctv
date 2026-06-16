<?php

namespace App\Filament\Widgets;

use App\Enums\CctvStatus;
use App\Models\Cctv;
use Filament\Support\Enums\IconPosition;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CctvStatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected int|string|array $columnSpan = 'full';

    public function getColumns(): int|array|null
    {
        return 3;
    }

    protected function getHeading(): ?string
    {
        $today = date('d F Y');

        return "Network Monitoring - {$today}";
    }

    protected function getDescription(): ?string
    {
        return 'Camera operational status updated in real-time by system sensors.';
    }

    protected function getStats(): array
    {
        $total = Cctv::count();
        $online = Cctv::where('status', CctvStatus::Online)->count();
        $offline = Cctv::where('status', CctvStatus::Offline)->count();

        $onlinePct = $total > 0 ? round(($online / $total) * 100) : 0;
        $offlinePct = $total > 0 ? round(($offline / $total) * 100) : 0;

        return [
            Stat::make('Total CCTV', $total)
                ->description('All registered CCTV')
                ->descriptionIcon('heroicon-o-circle-stack', IconPosition::Before)
                ->color('gray'),

            Stat::make('Online', $online)
                ->description("Running Normal ({$onlinePct}%)")
                ->descriptionIcon('heroicon-o-check-circle', IconPosition::Before)
                ->color('success'),

            Stat::make('Offline', $offline)
                ->description("Disconnected ({$offlinePct}%)")
                ->descriptionIcon('heroicon-o-x-circle', IconPosition::Before)
                ->color('danger'),
        ];
    }
}
