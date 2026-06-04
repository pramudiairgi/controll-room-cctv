<?php

namespace Database\Factories;

use App\Enums\AssetCategory;
use App\Enums\CctvStatus;
use App\Models\Cctv;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Cctv>
 */
class CctvFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => $this->faker->sentence(3),
            'category' => $this->faker->randomElement(array_values(AssetCategory::cases()))->value,
            'location' => $this->faker->address,
            'latitude' => $this->faker->latitudeBetween(-7.1, -6.8),
            'longitude' => $this->faker->longitudeBetween(110.35, 110.72),
            'stream_id' => $this->faker->bothify('???????????'),
            'status' => $this->faker->randomElement(array_values(CctvStatus::cases()))->value,
            'notes' => $this->faker->sentence,
        ];
    }
}
