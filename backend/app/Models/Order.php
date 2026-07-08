<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_number',
        'user_id',
        'status',
        'payment_method',
        'payment_status',
        'subtotal',
        'delivery_fee',
        'discount_total',
        'grand_total',
        'coupon_id',
        'shipping_name',
        'shipping_phone',
        'shipping_district',
        'shipping_upazila',
        'shipping_address',
        'customer_note',
        'admin_note',
        'placed_at',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'delivery_fee' => 'decimal:2',
        'discount_total' => 'decimal:2',
        'grand_total' => 'decimal:2',
        'placed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * e.g. PK-20260708-0001 — date-scoped sequence, human-friendly for order
     * tracking. Must be called inside the same DB transaction as the Order
     * insert (see Actions/PlaceOrderFromCart) — the row lock here is what
     * makes concurrent checkouts safe.
     */
    public static function generateOrderNumber(): string
    {
        $today = now()->toDateString();

        // ensure the row exists before locking it — INSERT ... ON DUPLICATE
        // KEY is a no-op if it's already there, avoiding a lock-then-miss race
        DB::statement(
            'INSERT INTO order_number_sequences (date, last_sequence) VALUES (?, 0)
             ON DUPLICATE KEY UPDATE date = date',
            [$today]
        );

        $sequence = DB::table('order_number_sequences')
            ->where('date', $today)
            ->lockForUpdate()
            ->first();

        $next = $sequence->last_sequence + 1;

        DB::table('order_number_sequences')
            ->where('date', $today)
            ->update(['last_sequence' => $next]);

        return sprintf('PK-%s-%04d', now()->format('Ymd'), $next);
    }

    public function markConfirmed(): void
    {
        $this->update(['status' => 'confirmed']);
    }

    public function markShipped(): void
    {
        $this->update(['status' => 'shipped']);
    }

    public function markDelivered(): void
    {
        $this->update(['status' => 'delivered']);
    }

    public function markCancelled(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function recalculateTotals(): void
    {
        $subtotal = (float) $this->items()->sum('line_total');
        $grandTotal = $subtotal + (float) $this->delivery_fee - (float) $this->discount_total;

        $this->update([
            'subtotal' => $subtotal,
            'grand_total' => max($grandTotal, 0),
        ]);
    }
}
