<?php

namespace App\Actions;

use App\Models\Cart;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Payment;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

/**
 * Turns a Cart into an Order + OrderItems + a Payment record, per the
 * checkout flow in docs/backend-architecture.md §5.
 *
 * Always re-validates against current product state (sold_out, price) —
 * never trusts client-sent prices, only the cart's snapshotted unit_price
 * is used, and even that is re-checked against sold_out at execution time.
 */
class PlaceOrderFromCart
{
    public function __construct(private readonly Cart $cart) {}

    /**
     * @param  array{name: string, phone: string, district: string, upazila: ?string, address: string}  $shipping
     * @param  array{transaction_id?: ?string, sender_number?: ?string}  $paymentDetails
     */
    public function execute(
        string $paymentMethod,
        array $shipping,
        ?string $customerNote,
        array $paymentDetails,
        ?string $couponCode,
        float $deliveryFee = 0.0,
    ): Order {
        $items = $this->cart->items()->with('product')->get();

        if ($items->isEmpty()) {
            throw ValidationException::withMessages(['cart' => 'Your cart is empty.']);
        }

        foreach ($items as $item) {
            if (! $item->product || $item->product->sold_out) {
                throw ValidationException::withMessages([
                    'cart' => "\"{$item->product?->name_en}\" is sold out and was removed from your cart.",
                ]);
            }
        }

        return DB::transaction(function () use ($items, $paymentMethod, $shipping, $customerNote, $paymentDetails, $couponCode, $deliveryFee) {
            $subtotal = (float) $items->sum(fn ($item) => $item->unit_price * $item->quantity);

            $coupon = null;
            $discountTotal = 0.0;

            if ($couponCode) {
                $coupon = Coupon::where('code', $couponCode)->lockForUpdate()->first();

                if (! $coupon || ! $coupon->isValid()) {
                    throw ValidationException::withMessages(['coupon' => 'This coupon is invalid or expired.']);
                }

                $discountTotal = $coupon->discountFor($subtotal);
            }

            $grandTotal = max($subtotal + $deliveryFee - $discountTotal, 0);

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $this->cart->user_id,
                'status' => 'pending',
                'payment_method' => $paymentMethod,
                'payment_status' => 'unpaid',
                'subtotal' => $subtotal,
                'delivery_fee' => $deliveryFee,
                'discount_total' => $discountTotal,
                'grand_total' => $grandTotal,
                'coupon_id' => $coupon?->id,
                'shipping_name' => $shipping['name'],
                'shipping_phone' => $shipping['phone'],
                'shipping_district' => $shipping['district'],
                'shipping_upazila' => $shipping['upazila'] ?? null,
                'shipping_address' => $shipping['address'],
                'customer_note' => $customerNote,
                'placed_at' => now(),
            ]);

            foreach ($items as $item) {
                $order->items()->create([
                    'product_id' => $item->product_id,
                    'product_name_en' => $item->product->name_en,
                    'product_name_bn' => $item->product->name_bn,
                    'unit_price' => $item->unit_price,
                    'quantity' => $item->quantity,
                    'line_total' => $item->unit_price * $item->quantity,
                ]);
            }

            Payment::create([
                'order_id' => $order->id,
                'method' => $paymentMethod,
                'transaction_id' => $paymentDetails['transaction_id'] ?? null,
                'sender_number' => $paymentDetails['sender_number'] ?? null,
                'amount' => $grandTotal,
                'status' => 'pending',
            ]);

            if ($coupon) {
                $coupon->increment('used_count');
            }

            $this->cart->items()->delete();

            return $order->load(['items', 'payments']);
        });
    }
}
