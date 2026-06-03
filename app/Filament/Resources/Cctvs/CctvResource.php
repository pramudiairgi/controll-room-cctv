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
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class CctvResource extends Resource
{
    protected static ?string $model = Cctv::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

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
