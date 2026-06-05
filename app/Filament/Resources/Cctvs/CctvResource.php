<?php

namespace App\Filament\Resources\Cctvs;

use App\Filament\Resources\Cctvs\Pages\CreateCctv;
use App\Filament\Resources\Cctvs\Pages\EditCctv;
use App\Filament\Resources\Cctvs\Pages\ListCctvs;
use App\Filament\Resources\Cctvs\Schemas\CctvForm;
use App\Filament\Resources\Cctvs\Tables\CctvsTable;
use App\Models\Cctv;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;
use Illuminate\Support\HtmlString;

class CctvResource extends Resource
{
    protected static ?string $model = Cctv::class;

    public static function getNavigationIcon(): string|BackedEnum|HtmlString|null
    {
        return new HtmlString('<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.75 12h3.632a1 1 0 0 1 .894 1.447l-2.034 4.069a1 1 0 0 1-1.708.134l-2.124-2.97"/>
            <path d="M17.106 9.053a1 1 0 0 1 .447 1.341l-3.106 6.211a1 1 0 0 1-1.342.447L3.61 12.3a2.92 2.92 0 0 1-1.3-3.91L3.69 5.6a2.92 2.92 0 0 1 3.92-1.3z"/>
            <path d="M2 19h3.76a2 2 0 0 0 1.8-1.1L9 15"/>
            <path d="M2 21v-4"/>
            <path d="M7 9h.01"/>
        </svg>');
    }

    public static function form(Schema $schema): Schema
    {
        return CctvForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return CctvsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListCctvs::route('/'),
            'create' => CreateCctv::route('/create'),
            'edit' => EditCctv::route('/{record}/edit'),
        ];
    }
}
