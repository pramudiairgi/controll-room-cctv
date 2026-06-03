<?php

namespace Tests\Unit;

use App\Models\Cctv;
use Database\Factories\CctvFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CctvFactoryTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_creates_cctv_within_demak_bounding_box()
    {
        $cctv = Cctv::factory()->create();

        // Demak bounding box: -7.1 to -6.8 lat, 110.35 to 110.72 lng
        $this->assertGreaterThanOrEqual(-7.1, (float) $cctv->latitude);
        $this->assertLessThanOrEqual(-6.8, (float) $cctv->latitude);
        $this->assertGreaterThanOrEqual(110.35, (float) $cctv->longitude);
        $this->assertLessThanOrEqual(110.72, (float) $cctv->longitude);
    }

    /** @test */
    public function it_creates_cctv_with_valid_data()
    {
        $cctv = Cctv::factory()->create();

        $this->assertNotNull($cctv->name);
        $this->assertNotNull($cctv->category);
        $this->assertNotNull($cctv->location);
        $this->assertNotNull($cctv->latitude);
        $this->assertNotNull($cctv->longitude);
        $this->assertNotNull($cctv->status);
        $this->assertTrue(
            in_array($cctv->category, ['traffic', 'public_facility', 'disaster', 'security', 'environment'])
        );
        $this->assertTrue(
            in_array($cctv->status, ['active', 'inactive', 'maintenance'])
        );
    }
}