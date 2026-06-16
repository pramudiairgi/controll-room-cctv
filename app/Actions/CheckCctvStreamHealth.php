<?php

namespace App\Actions;

use App\Enums\CctvStatus;
use App\Models\Cctv;
use App\Services\YoutubeLiveService;

class CheckCctvStreamHealth
{
    public function __construct(
        private readonly YoutubeLiveService $youtubeLive,
    ) {}

    public function checkAll(): array
    {
        $cameras = Cctv::whereNotNull('stream_id')->get();

        if ($cameras->isEmpty()) {
            return ['total' => 0, 'online' => 0, 'offline' => 0];
        }

        $ids = $cameras->pluck('stream_id')->toArray();
        $results = $this->youtubeLive->check($ids);

        $online = 0;
        $offline = 0;

        foreach ($cameras as $camera) {
            $isLive = $results[$camera->stream_id] ?? false;

            $camera->update([
                'is_live' => $isLive,
                'status' => $isLive ? CctvStatus::Online : CctvStatus::Offline,
            ]);

            if ($isLive) {
                $online++;
            } else {
                $offline++;
            }
        }

        return [
            'total' => $cameras->count(),
            'online' => $online,
            'offline' => $offline,
        ];
    }
}
