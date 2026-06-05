<?php

namespace App\Filament\Widgets;

use App\Models\Cctv;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class CctvStatsOverviewWidget extends BaseWidget
{
    protected static ?int $sort = 1;

    protected int | string | array $columnSpan = 'full';

    public function getColumns(): int | array | null
    {
        return 2;
    }

    protected function getStats(): array
    {
        $total = Cctv::count();
        $online = Cctv::where('status', 'online')->count();
        $offline = Cctv::where('status', 'offline')->count();
        $warning = Cctv::where('status', 'warning')->count();

        $onlinePct = $total > 0 ? round(($online / $total) * 100) : 0;
        $offlinePct = $total > 0 ? round(($offline / $total) * 100) : 0;
        $warningPct = $total > 0 ? round(($warning / $total) * 100) : 0;

        return [
            Stat::make('Total CCTV', $total)
                ->description('Semua CCTV terdaftar')
                ->descriptionIcon('heroicon-o-circle-stack')
                ->color('gray'),

            Stat::make('Online', $online)
                ->description("aktif")
                ->descriptionIcon('heroicon-o-check-circle')
                ->color('success'),

            Stat::make('Warning', $warning)
                ->description("terganggu")
                ->descriptionIcon('heroicon-o-exclamation-triangle')
                ->color('warning'),

            Stat::make('Offline', $offline)
                ->description("tidak terhubung")
                ->descriptionIcon('heroicon-o-x-circle')
                ->color('danger'),
        ];
    }
}
