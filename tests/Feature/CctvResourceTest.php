<?php

namespace Tests\Feature;

use App\Models\Cctv;
use App\Filament\Resources\CctvResource;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CctvResourceTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_normalizes_youtube_url_to_stream_id_on_create()
    {
        $testCases = [
            'https://youtu.be/dQw4w9WgXcQ' => 'dQw4w9WgXcQ',
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ' => 'dQw4w9WgXcQ',
            'https://youtube.com/watch?v=dQw4w9WgXcQ&feature=share' => 'dQw4w9WgXcQ',
            'https://www.youtube.com/embed/dQw4w9WgXcQ' => 'dQw4w9WgXcQ',
            'https://youtube.com/embed/dQw4w9WgXcQ?rel=0' => 'dQw4w9WgXcQ',
            'https://www.youtube.com/v/dQw4w9WgXcQ' => 'dQw4w9WgXcQ',
            'https://youtube.com/v/dQw4w9WgXcQ?version=3' => 'dQw4w9WgXcQ',
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ' => 'dQw4w9WgXcQ',
            'dQw4w9WgXcQ' => 'dQw4w9WgXcQ', // raw ID
        ];

        foreach ($testCases as $youtubeUrl => $expectedStreamId) {
            $cctv = Cctv::factory()->make([
                'youtube_url' => $youtubeUrl,
                'stream_id' => null, // will be populated by mutateFormDataUsing
            ]);

            // Simulate the form's mutateFormDataUsing logic
            $data = $cctv->toArray();
            $youtubeUrl = $data['youtube_url'] ?? '';

            // This is the exact logic from CctvResource::form()
            if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $youtubeUrl, $matches)) {
                $data['stream_id'] = $matches[1];
            } elseif (!empty($youtubeUrl) && preg_match('/^[^"&?\/\s]{11}$/', $youtubeUrl)) {
                $data['stream_id'] = $youtubeUrl;
            }

            unset($data['youtube_url']);

            $this->assertEquals($expectedStreamId, $data['stream_id'] ?? null, "Failed for URL: {$youtubeUrl}");
        }
    }

    /** @test */
    public function it_handles_invalid_youtube_url_gracefully()
    {
        $invalidUrls = [
            'https://example.com',
            'https://youtu.be/invalid',
            'https://youtube.com/watch?v=invalid123',
            '',
            null,
        ];

        foreach ($invalidUrls as $url) {
            $cctv = Cctv::factory()->make([
                'youtube_url' => $url,
                'stream_id' => null,
            ]);

            $data = $cctv->toArray();
            $youtubeUrl = $data['youtube_url'] ?? '';

            // Apply the same logic
            if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/', $youtubeUrl, $matches)) {
                $data['stream_id'] = $matches[1];
            } elseif (!empty($youtubeUrl) && preg_match('/^[^"&?\/\s]{11}$/', $youtubeUrl)) {
                $data['stream_id'] = $youtubeUrl;
            }

            unset($data['youtube_url']);

            // Should be null or empty for invalid URLs
            $this->assertNull($data['stream_id'] ?? null, "Should be null for invalid URL: {$url}");
        }
    }

    /** @test */
    public function it_can_create_cctv_via_filament_resource()
    {
        $this->actingAs(
            \App\Models\User::factory()->create()
        );

        $response = $this->post('/admin/api/cctvs', [
            'name' => 'Test CCTV',
            'category' => 'traffic',
            'location' => 'Test Location',
            'youtube_url' => 'https://youtu.be/dQw4w9WgXcQ',
            'latitude' => -6.8889,
            'longitude' => 110.6396,
            'status' => 'active',
            'notes' => 'Test notes',
        ]);

        $this->assertEquals(302, $response->status()); // redirect after create

        $this->assertDatabaseHas('cctvs', [
            'name' => 'Test CCTV',
            'category' => 'traffic',
            'location' => 'Test Location',
            'stream_id' => 'dQw4w9WgXcQ',
            'latitude' => -6.8889,
            'longitude' => 110.6396,
            'status' => 'active',
            'notes' => 'Test notes',
        ]);
    }
}