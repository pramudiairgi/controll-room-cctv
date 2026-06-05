<?php

namespace App\Enums;

use Filament\Support\Contracts\HasLabel;

enum CctvStatus: string implements HasLabel
{
    case Online = 'online';
    case Warning = 'warning';
    case Offline = 'offline';

    public function getLabel(): string
    {
        return match ($this) {
            self::Online => 'Online',
            self::Warning => 'Warning',
            self::Offline => 'Offline',
        };
    }
}