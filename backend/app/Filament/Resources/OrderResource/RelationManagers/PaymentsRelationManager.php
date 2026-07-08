<?php

namespace App\Filament\Resources\OrderResource\RelationManagers;

use Filament\Notifications\Notification;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables\Actions\Action;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PaymentsRelationManager extends RelationManager
{
    protected static string $relationship = 'payments';

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('transaction_id')
            ->columns([
                TextColumn::make('method')->badge(),
                TextColumn::make('transaction_id')->label('TrxID')->placeholder('—'),
                TextColumn::make('sender_number')->placeholder('—'),
                TextColumn::make('amount')->money('BDT'),
                BadgeColumn::make('status')->colors([
                    'gray' => 'pending',
                    'success' => 'verified',
                    'danger' => 'rejected',
                ]),
            ])
            ->actions([
                Action::make('verify')
                    ->label('Verify')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->update([
                            'status' => 'verified',
                            'verified_by' => auth()->id(),
                            'verified_at' => now(),
                        ]);

                        $record->order->update(['payment_status' => 'paid']);

                        Notification::make()
                            ->title('Payment verified')
                            ->success()
                            ->send();
                    }),
                Action::make('reject')
                    ->label('Reject')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->action(fn ($record) => $record->update(['status' => 'rejected'])),
            ]);
    }
}
