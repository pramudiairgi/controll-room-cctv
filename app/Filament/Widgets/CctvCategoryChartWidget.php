<?php

namespace App\Filament\Widgets;

use App\Models\Cctv;
use Filament\Widgets\ChartWidget;

class CctvCategoryChartWidget extends ChartWidget
{
    protected ?string $heading = 'CCTV by Category';

    protected ?int $sort = 2;

    protected function getType(): string
    {
        return 'doughnut';
    }

    protected function getData(): array
    {
        $data = Cctv::whereNotNull('category')
            ->selectRaw('category, count(*) as total')
            ->groupBy('category')
            ->get();

        $colors = [
            'traffic' => '#3B82F6',
            'public_facility' => '#10B981',
            'disaster' => '#EF4444',
            'security' => '#F59E0B',
            'environment' => '#8B5CF6',
        ];

        return [
            'datasets' => [
                [
                    'data' => $data->pluck('total')->toArray(),
                    'backgroundColor' => $data->map(fn ($item) => $colors[$item->category->value] ?? '#6B7280')->toArray(),
                ],
            ],
            'labels' => $data->map(fn ($item) => $item->category->getLabel())->toArray(),
        ];
    }
}
