<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Cctv;

class CctvSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $cctvs = [
            [
                'name' => 'CCTV Alun-Alun Demak',
                'category' => 'public_facility',
                'location' => 'Jl. Sultan Fatah No.1, Demak',
                'latitude' => -6.8889,
                'longitude' => 110.6396,
                'status' => 'active',
                'notes' => null,
                'stream_id' => null,
            ],
            [
                'name' => 'CCTV Simpang Mranggen',
                'category' => 'traffic',
                'location' => 'Mranggen',
                'latitude' => -7.0240,
                'longitude' => 110.5170,
                'status' => 'active',
                'notes' => null,
                'stream_id' => null,
            ],
            [
                'name' => 'CCTV Pasar Karangawen',
                'category' => 'public_facility',
                'location' => 'Karangawen',
                'latitude' => -7.0790,
                'longitude' => 110.5620,
                'status' => 'active',
                'notes' => null,
                'stream_id' => null,
            ],
            [
                'name' => 'CCTV Gerbang Guntur',
                'category' => 'security',
                'location' => 'Guntur',
                'latitude' => -6.9740,
                'longitude' => 110.6044,
                'status' => 'active',
                'notes' => null,
                'stream_id' => null,
            ],
            [
                'name' => 'CCTV Exit Tol Sayung',
                'category' => 'traffic',
                'location' => 'Sayung',
                'latitude' => -6.9346,
                'longitude' => 110.4989,
                'status' => 'maintenance',
                'notes' => null,
                'stream_id' => null,
            ],
            [
                'name' => 'CCTV Kantor Kec. Bonang',
                'category' => 'public_facility',
                'location' => 'Bonang',
                'latitude' => -6.8860,
                'longitude' => 110.5510,
                'status' => 'active',
                'notes' => null,
                'stream_id' => null,
            ],
            [
                'name' => 'CCTV Simpang Dempet',
                'category' => 'traffic',
                'location' => 'Dempet',
                'latitude' => -6.9670,
                'longitude' => 110.7021,
                'status' => 'active',
                'notes' => null,
                'stream_id' => null,
            ],
            [
                'name' => 'CCTV Pantai Wedung',
                'category' => 'environment',
                'location' => 'Wedung',
                'latitude' => -6.8031,
                'longitude' => 110.6680,
                'status' => 'inactive',
                'notes' => null,
                'stream_id' => null,
            ],
            [
                'name' => 'CCTV Perempatan Karangtengah',
                'category' => 'traffic',
                'location' => 'Karangtengah',
                'latitude' => -6.9100,
                'longitude' => 110.6445,
                'status' => 'active',
                'notes' => null,
                'stream_id' => null,
            ],
            [
                'name' => 'CCTV Balai Desa Wonosalam',
                'category' => 'public_facility',
                'location' => 'Wonosalam',
                'latitude' => -6.8900,
                'longitude' => 110.6780,
                'status' => 'active',
                'notes' => null,
                'stream_id' => null,
            ],
        ];

        foreach ($cctvs as $cctv) {
            Cctv::create($cctv);
        }
    }
}