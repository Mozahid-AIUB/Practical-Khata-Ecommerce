<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'items';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('product_name_en')
            ->columns([
                TextColumn::make('product_name_en')->label('Product'),
                TextColumn::make('unit_price')->money('BDT'),
                TextColumn::make('quantity'),
                TextColumn::make('line_total')->money('BDT'),
            ]);
    }
}
