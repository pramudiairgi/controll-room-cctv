<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum AssetCategory: string implements HasLabel
{
    case Traffic = 'traffic';
    case PublicFacility = 'public_facility';
    case Disaster = 'disaster';
    case Security = 'security';
    case Environment = 'environment';

    public function getLabel(): string
    {
        return match ($this) {
            self::Traffic => 'Traffic',
            self::PublicFacility => 'Public Facility',
            self::Disaster => 'Disaster',
            self::Security => 'Security',
            self::Environment => 'Environment',
        };
    }
}