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
        $youtubeUrl = $this->faker->optional(0.7)->randomElement([
            'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            'https://www.youtube.com/watch?v=9bZkp7q19f0',
            'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
            'https://www.youtube.com/watch?v=RgKAFK5djSk',
            'https://www.youtube.com/watch?v=JGwWNGJdvx8',
            'https://youtu.be/dQw4w9WgXcQ',
            'https://www.youtube.com/watch?v=OPf0YbXqDm0',
        ]);

        return [
            'name' => $this->faker->sentence(3),
            'category' => $this->faker->randomElement(array_values(AssetCategory::cases()))->value,
            'location' => $this->faker->address,
            'latitude' => $this->faker->latitudeBetween(-7.1, -6.8),
            'longitude' => $this->faker->longitudeBetween(110.35, 110.72),
            'youtube_url' => $youtubeUrl,
            'stream_id' => $youtubeUrl ? Cctv::extractYouTubeId($youtubeUrl) : null,
            'status' => $this->faker->randomElement(array_values(CctvStatus::cases()))->value,
            'failed_checks_count' => 0,
            'notes' => $this->faker->sentence,
        ];
    }
}
