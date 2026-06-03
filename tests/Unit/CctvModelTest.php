<?php

namespace Tests\Unit;

use App\Models\Cctv;
use App\Enums\AssetCategory;
use App\Enums\CctvStatus;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CctvModelTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_has_correct_fillable_fields()
    {
        $cctv = new Cctv();
        $fillable = $cctv->getFillable();

        $this->assertEquals([
            'name',
            'category',
            'location',
            'latitude',
            'longitude',
            'stream_id',
            'status',
            'notes',
        ], $fillable);
    }

    /** @test */
    public function it_casts_status_enum()
    {
        $cctv = Cctv::factory()->create([
            'status' => 'active',
        ]);

        $this->assertInstanceOf(CctvStatus::class, $cctv->status);
        $this->assertEquals(CctvStatus::Active, $cctv->status);
    }

    /** @test */
    public function it_casts_category_enum()
    {
        $cctv = Cctv::factory()->create([
            'category' => 'traffic',
        ]);

        $this->assertInstanceOf(AssetCategory::class, $cctv->category);
        $this->assertEquals(AssetCategory::Traffic, $cctv->category);
    }

    /** @test */
    public function it_decimal_casts_latitude_and_longitude()
    {
        $cctv = Cctv::factory()->create([
            'latitude' => -6.8889,
            'longitude' => 110.6396,
        ]);

        $this->isTypeOf('string', $cctv->latitude); // Eloquent returns cast decimals as strings
        $this->isTypeOf('string', $cctv->longitude);
        $this->assertEquals('-6.8889000', $cctv->latitude);
        $this->assertEquals('110.6396000', $cctv->longitude);
    }
}