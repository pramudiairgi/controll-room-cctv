<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum CctvStatus: string implements HasLabel
{
    case Active = 'active';
    case Inactive = 'inactive';
    case Maintenance = 'maintenance';

    public function getLabel(): string
    {
        return match ($this) {
            self::Active => 'Active',
            self::Inactive => 'Inactive',
            self::Maintenance => 'Maintenance',
        };
    }
}