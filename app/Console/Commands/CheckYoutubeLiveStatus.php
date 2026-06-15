<?php

namespace App\Console\Commands;

use App\Models\Cctv;
use App\Services\YoutubeLiveService;
use Illuminate\Console\Command;

class CheckYoutubeLiveStatus extends Command
{
    protected $signature = 'cctv:check-youtube-live';
    protected $description = 'Check which CCTVs are currently live via YouTube Data API';

    public function handle(YoutubeLiveService $service): int
    {
        $cameras = Cctv::whereNotNull('stream_id')->get();

        if ($cameras->isEmpty()) {
            $this->info('No cameras with stream_id found.');
            return 0;
        }

        $ids = $cameras->pluck('stream_id')->toArray();
        $results = $service->check($ids);

        $liveCount = 0;
        foreach ($cameras as $camera) {
            $isLive = $results[$camera->stream_id] ?? false;
            $camera->update(['is_live' => $isLive]);
            if ($isLive) $liveCount++;
        }

        $this->info("Checked {$cameras->count()} cameras. {$liveCount} are live.");
        return 0;
    }
}
