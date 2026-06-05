<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\CctvStatus;
use App\Enums\AssetCategory;

class Cctv extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'location',
        'latitude',
        'longitude',
        'stream_id',
        'youtube_url',
        'status',
        'notes',
    ];

    protected $casts = [
        'status' => CctvStatus::class,
        'category' => AssetCategory::class,
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];

    public static function extractYouTubeId(?string $url): ?string
    {
        if (empty($url)) {
            return null;
        }

        if (preg_match('/(?:youtube\.com\/(?:[^\/]+\/.+\/|shorts\/|live\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([0-9A-Za-z_-]{11})/', $url, $matches)) {
            return $matches[1];
        }

        if (preg_match('/^[0-9A-Za-z_-]{11}$/', $url)) {
            return $url;
        }

        return null;
    }
}