<?php

namespace App\Console\Commands;

use App\Actions\CheckCctvStreamHealth;
use Illuminate\Console\Command;

class CheckCctvStreams extends Command
{
    protected $signature = 'cctv:check-health';

    protected $description = 'Check health of all CCTV streams via YouTube Data API (batch)';

    public function handle(CheckCctvStreamHealth $action): int
    {
        $this->info('Checking CCTV stream health...');

        $result = $action->checkAll();

        if ($result['total'] === 0) {
            $this->info('No CCTV streams to check.');
            return self::SUCCESS;
        }

        $this->info("Checked {$result['total']} stream(s): {$result['online']} online, {$result['offline']} offline.");

        return self::SUCCESS;
    }
}
