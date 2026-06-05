<?php

namespace App\Console\Commands;

use App\Actions\CheckCctvStreamHealth;
use App\Models\Cctv;
use Illuminate\Console\Command;

class CheckCctvStreams extends Command
{
    protected $signature = 'cctv:check-streams';
    protected $description = 'Check health of all CCTV streams via YouTube oEmbed';

    public function handle(CheckCctvStreamHealth $action): int
    {
        $cctvs = Cctv::whereNotNull('stream_id')->get();

        if ($cctvs->isEmpty()) {
            $this->info('No CCTV streams to check.');
            return self::SUCCESS;
        }

        $this->info("Checking {$cctvs->count()} CCTV stream(s)...");

        foreach ($cctvs as $cctv) {
            $action->check($cctv);
            $this->line("Checked: {$cctv->name} ({$cctv->stream_id}) -> {$cctv->fresh()->status->value}");
        }

        $this->info('Stream check complete.');

        return self::SUCCESS;
    }
}
