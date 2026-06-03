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
        'status',
        'notes',
    ];

    protected $casts = [
        'status' => CctvStatus::class,
        'category' => AssetCategory::class,
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];
}