<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers\ImagesRelationManager;
use App\Models\Category;
use App\Models\Product;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-book-open';

    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form->schema([
            Section::make('Basics')->schema([
                Select::make('category_id')
                    ->relationship('category', 'name_en')
                    ->options(fn () => Category::orderBy('sort_order')->pluck('name_en', 'id'))
                    ->required()
                    ->searchable(),
                TextInput::make('name_en')->label('Name (English)')->required()->maxLength(255),
                TextInput::make('name_bn')->label('Name (Bangla)')->required()->maxLength(255),
                TextInput::make('slug')->required()->unique(ignoreRecord: true)->maxLength(255),
            ])->columns(2),

            Section::make('Classification')->schema([
                Select::make('subject')
                    ->options([
                        'physics' => 'Physics',
                        'chemistry' => 'Chemistry',
                        'biology' => 'Biology',
                        'math' => 'Higher Math',
                        'ict' => 'ICT',
                        'agriculture' => 'Agriculture',
                        'bundle' => 'Bundle',
                        'assignment' => 'Assignment',
                    ])
                    ->required(),
                Select::make('level')
                    ->options(['ssc' => 'SSC', 'hsc' => 'HSC'])
                    ->nullable(),
                Select::make('paper')
                    ->options([1 => '1st Paper', 2 => '2nd Paper'])
                    ->nullable(),
            ])->columns(3),

            Section::make('Pricing')->schema([
                TextInput::make('price_min')->numeric()->prefix('৳')->required(),
                TextInput::make('price_max')->numeric()->prefix('৳')->nullable(),
                TextInput::make('original_price')
                    ->numeric()
                    ->prefix('৳')
                    ->nullable()
                    ->helperText('Set higher than price_min to show a discount badge.'),
            ])->columns(3),

            Section::make('Flags')->schema([
                Toggle::make('best_seller'),
                Toggle::make('sold_out'),
            ])->columns(2),

            Section::make('Descriptions')->schema([
                Textarea::make('description_en')->rows(3)->nullable(),
                Textarea::make('description_bn')->rows(3)->nullable(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name_en')->label('Name')->searchable(),
                TextColumn::make('category.name_en')->label('Category')->sortable(),
                TextColumn::make('subject')->badge(),
                TextColumn::make('level')->badge(),
                TextColumn::make('paper'),
                TextColumn::make('price_min')->money('BDT')->label('Price'),
                IconColumn::make('best_seller')->boolean(),
                IconColumn::make('sold_out')->boolean(),
            ])
            ->filters([
                SelectFilter::make('category')->relationship('category', 'name_en'),
                SelectFilter::make('level')->options(['ssc' => 'SSC', 'hsc' => 'HSC']),
                TernaryFilter::make('sold_out'),
                TernaryFilter::make('best_seller'),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getRelations(): array
    {
        return [
            ImagesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }
}
