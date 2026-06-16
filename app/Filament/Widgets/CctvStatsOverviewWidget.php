<?php

namespace App\Filament\Widgets;

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
        return 4;
    }

    protected function getHeading(): ?string
    {
        $tanggalHariIni = date('d F Y');

        return "Pemantauan Jaringan - {$tanggalHariIni}";
    }

    protected function getDescription(): ?string
    {
        return 'Status operasional titik kamera diperbarui secara real-time oleh sensor sistem.';
    }

    protected function getStats(): array
    {
        $total = Cctv::count();
        $online = Cctv::where('status', 'online')->count();
        $offline = Cctv::where('status', 'offline')->count();

        $onlinePct = $total > 0 ? round(($online / $total) * 100) : 0;
        $offlinePct = $total > 0 ? round(($offline / $total) * 100) : 0;

        return [
            Stat::make('Total CCTV', $total)
                ->description('Semua CCTV terdaftar')
                ->descriptionIcon('heroicon-o-circle-stack', IconPosition::Before)
                ->color('gray'),

            Stat::make('Online', $online)
                ->description("Berjalan Normal ({$onlinePct}%)")
                ->descriptionIcon('heroicon-o-check-circle', IconPosition::Before)
                ->color('success'),

            Stat::make('Offline', $offline)
                ->description("Tidak Terhubung ({$offlinePct}%)")
                ->descriptionIcon('heroicon-o-x-circle', IconPosition::Before)
                ->color('danger'),
        ];
    }
}
