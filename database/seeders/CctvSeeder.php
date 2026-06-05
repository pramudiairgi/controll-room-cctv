<?php

namespace Database\Seeders;

use App\Models\Cctv;
use Illuminate\Database\Seeder;

class CctvSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cctvs = [
            [
                'name' => 'CCTV JL. Pantura Onggorawe Jembatan [1]',
                'category' => 'traffic',
                'location' => 'Jl. Pantura Onggorawe, Demak',
                'latitude' => -6.9104,
                'longitude' => 110.6639,
                'youtube_url' => 'https://www.youtube.com/watch?v=0T9mhMrwBAk',
                'stream_id' => '0T9mhMrwBAk',
                'status' => 'active',
                'notes' => 'Live CCTV Dishub Kab. Demak',
            ],
            [
                'name' => 'CCTV Pertigaan Jembatan Kracaan Demak [01]',
                'category' => 'traffic',
                'location' => 'Jembatan Kracaan, Demak',
                'latitude' => -6.8930,
                'longitude' => 110.6390,
                'youtube_url' => 'https://www.youtube.com/watch?v=A2Lgrc0B4Rw',
                'stream_id' => 'A2Lgrc0B4Rw',
                'status' => 'active',
                'notes' => 'Live CCTV Dishub Kab. Demak',
            ],
            [
                'name' => 'CCTV JL. Pantura Sayung Demak [01]',
                'category' => 'traffic',
                'location' => 'Jl. Pantura Sayung, Demak',
                'latitude' => -6.9346,
                'longitude' => 110.4989,
                'youtube_url' => 'https://www.youtube.com/watch?v=Cn3yyH-KTOE',
                'stream_id' => 'Cn3yyH-KTOE',
                'status' => 'active',
                'notes' => 'Live CCTV Dishub Kab. Demak',
            ],
            [
                'name' => 'CCTV Pertigaan Depan Kabupaten Demak [2]',
                'category' => 'traffic',
                'location' => 'Depan Kantor Kabupaten Demak',
                'latitude' => -6.8915,
                'longitude' => 110.6398,
                'youtube_url' => 'https://www.youtube.com/watch?v=GHuRrOnW2MQ',
                'stream_id' => 'GHuRrOnW2MQ',
                'status' => 'active',
                'notes' => 'Live CCTV Dishub Kab. Demak',
            ],
            [
                'name' => 'CCTV Pertigaan Depan Kabupaten Demak [1]',
                'category' => 'traffic',
                'location' => 'Depan Kantor Kabupaten Demak',
                'latitude' => -6.8915,
                'longitude' => 110.6400,
                'youtube_url' => 'https://www.youtube.com/watch?v=SUhOdlj8aW8',
                'stream_id' => 'SUhOdlj8aW8',
                'status' => 'active',
                'notes' => 'Live CCTV Dishub Kab. Demak',
            ],
            [
                'name' => 'CCTV U-Turn Loireng Sayung [1]',
                'category' => 'traffic',
                'location' => 'Loireng, Sayung, Demak',
                'latitude' => -6.9310,
                'longitude' => 110.5050,
                'youtube_url' => 'https://www.youtube.com/watch?v=XoqlfevtBaE',
                'stream_id' => 'XoqlfevtBaE',
                'status' => 'active',
                'notes' => 'Live CCTV Dishub Kab. Demak',
            ],
            [
                'name' => 'CCTV U-Turn Loireng Sayung [2]',
                'category' => 'traffic',
                'location' => 'Loireng, Sayung, Demak',
                'latitude' => -6.9312,
                'longitude' => 110.5052,
                'youtube_url' => 'https://www.youtube.com/watch?v=axG6-jsmVqI',
                'stream_id' => 'axG6-jsmVqI',
                'status' => 'active',
                'notes' => 'Live CCTV Dishub Kab. Demak',
            ],
            [
                'name' => 'CCTV JL. Pantura Sayung Demak [02]',
                'category' => 'traffic',
                'location' => 'Jl. Pantura Sayung, Demak',
                'latitude' => -6.9348,
                'longitude' => 110.4991,
                'youtube_url' => 'https://www.youtube.com/watch?v=dTQ88A0B87Y',
                'stream_id' => 'dTQ88A0B87Y',
                'status' => 'active',
                'notes' => 'Live CCTV Dishub Kab. Demak',
            ],
            [
                'name' => 'CCTV Demak - Kudus Pasar Karanganyar [PTZ]',
                'category' => 'traffic',
                'location' => 'Pasar Karanganyar, Demak',
                'latitude' => -6.8890,
                'longitude' => 110.7050,
                'youtube_url' => 'https://www.youtube.com/watch?v=dY070ndSob0',
                'stream_id' => 'dY070ndSob0',
                'status' => 'active',
                'notes' => 'Live CCTV Dishub Kab. Demak',
            ],
            [
                'name' => 'CCTV Traffic Light Sultan Fatah Bogorame [01]',
                'category' => 'traffic',
                'location' => 'Jl. Sultan Fatah Bogorame, Demak',
                'latitude' => -6.8895,
                'longitude' => 110.6394,
                'youtube_url' => 'https://www.youtube.com/watch?v=uM1gksCoh8I',
                'stream_id' => 'uM1gksCoh8I',
                'status' => 'active',
                'notes' => 'Live CCTV Dishub Kab. Demak',
            ],
        ];

        foreach ($cctvs as $cctv) {
            Cctv::create($cctv);
        }
    }
}
