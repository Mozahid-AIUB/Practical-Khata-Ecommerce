<?php

namespace App\Http\Controllers\Api;

use App\Actions\PlaceOrderFromCart;
use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Cart;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(Request $request): JsonResource
    {
        $data = $request->validate([
            'cart_id' => ['required', 'integer', 'exists:carts,id'],
            'payment_method' => ['required', 'in:cod,bkash,nagad,rocket'],
            'shipping' => ['required', 'array'],
            'shipping.name' => ['required', 'string', 'max:255'],
            'shipping.phone' => ['required', 'string', 'max:20'],
            'shipping.district' => ['required', 'string', 'max:255'],
            'shipping.upazila' => ['nullable', 'string', 'max:255'],
            'shipping.address' => ['required', 'string'],
            'customer_note' => ['nullable', 'string'],
            'coupon_code' => ['nullable', 'string'],
            'delivery_fee' => ['nullable', 'numeric', 'min:0'],
            'payment' => ['sometimes', 'array'],
            'payment.transaction_id' => ['nullable', 'string', 'max:255'],
            'payment.sender_number' => ['nullable', 'string', 'max:20'],
        ]);

        $cart = Cart::findOrFail($data['cart_id']);

        // ownership check: guest carts are only trusted via the cart_session
        // cookie already having resolved to this cart in a prior /cart call —
        // authed users must own the cart outright.
        if ($request->user() && $cart->user_id !== $request->user()->id) {
            abort(403);
        }

        if (in_array($data['payment_method'], ['bkash', 'nagad', 'rocket'], true)
            && empty($data['payment']['transaction_id'] ?? null)) {
            throw ValidationException::withMessages([
                'payment.transaction_id' => 'A transaction ID is required for mobile banking payments.',
            ]);
        }

        $order = (new PlaceOrderFromCart($cart))->execute(
            paymentMethod: $data['payment_method'],
            shipping: $data['shipping'],
            customerNote: $data['customer_note'] ?? null,
            paymentDetails: $data['payment'] ?? [],
            couponCode: $data['coupon_code'] ?? null,
            deliveryFee: (float) ($data['delivery_fee'] ?? 0),
        );

        // TODO(phase 6+): dispatch OrderPlaced notification job (SMS/WhatsApp/email)

        return OrderResource::make($order);
    }

    public function track(Request $request): JsonResource
    {
        $data = $request->validate([
            'order_number' => ['required', 'string'],
            'phone' => ['required', 'string'],
        ]);

        $order = Order::with(['items', 'payments'])
            ->where('order_number', $data['order_number'])
            ->where('shipping_phone', $data['phone'])
            ->firstOrFail();

        return OrderResource::make($order);
    }
}
