<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Cart extends Model
{
    protected $fillable = [
        'user_id',
        'session_token',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(CartItem::class);
    }

    /** find-or-create the cart for the current request: authed user's cart, or a guest cart by session_token */
    public static function forRequest(?User $user, ?string $sessionToken): self
    {
        if ($user) {
            return static::firstOrCreate(['user_id' => $user->id]);
        }

        $sessionToken ??= (string) Str::uuid();

        return static::firstOrCreate(['session_token' => $sessionToken]);
    }

    public function addItem(Product $product, int $quantity = 1): CartItem
    {
        $item = $this->items()->firstOrNew(['product_id' => $product->id]);
        $item->unit_price = $product->price_min;
        $item->quantity = $item->exists ? $item->quantity + $quantity : $quantity;
        $item->save();

        return $item;
    }

    public function totalPrice(): float
    {
        return (float) $this->items->sum(fn (CartItem $item) => $item->unit_price * $item->quantity);
    }
}
