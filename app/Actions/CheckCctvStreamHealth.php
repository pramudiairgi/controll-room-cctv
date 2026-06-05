<?php

namespace App\Actions;

use App\Enums\CctvStatus;
use App\Models\Cctv;
use Illuminate\Support\Facades\Http;

class CheckCctvStreamHealth
{
    public function check(Cctv $cctv): void
    {
        if (!$cctv->stream_id) {
            return;
        }

        $oembedUrl = "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={$cctv->stream_id}&format=json";

        try {
            $response = Http::head($oembedUrl);

            if ($response->successful()) {
                $cctv->update([
                    'failed_checks_count' => 0,
                    'status' => CctvStatus::Online,
                ]);
            } else {
                $this->handleFailure($cctv);
            }
        } catch (\Exception $e) {
            $this->handleFailure($cctv);
        }
    }

    private function handleFailure(Cctv $cctv): void
    {
        $cctv->increment('failed_checks_count');

        if ($cctv->failed_checks_count >= 3) {
            $cctv->update(['status' => CctvStatus::Offline]);
        } elseif ($cctv->failed_checks_count >= 1) {
            $cctv->update(['status' => CctvStatus::Warning]);
        }
    }
}
