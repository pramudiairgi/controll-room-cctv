<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum CctvStatus: string implements HasLabel
{
    case Online = 'online';
    case Offline = 'offline';

    public function getLabel(): string
    {
        return match ($this) {
            self::Online => 'Online',
            self::Offline => 'Offline',
        };
    }
}
