<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Cookie;

class CartController extends Controller
{
    private const COOKIE_NAME = 'cart_session';

    private const COOKIE_MINUTES = 60 * 24 * 30; // 30 days

    public function show(Request $request): JsonResource
    {
        [$cart, $cookie] = $this->resolveCart($request);

        if ($cookie) {
            Cookie::queue($cookie);
        }

        return CartResource::make($cart->load('items.product.images'));
    }

    public function addItem(Request $request): JsonResource
    {
        $data = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
            'quantity' => ['sometimes', 'integer', 'min:1'],
        ]);

        [$cart, $cookie] = $this->resolveCart($request, createIfMissing: true);

        if ($cookie) {
            Cookie::queue($cookie);
        }

        $product = Product::findOrFail($data['product_id']);
        abort_if($product->sold_out, 422, 'This product is sold out.');

        $cart->addItem($product, $data['quantity'] ?? 1);

        return CartResource::make($cart->load('items.product.images'));
    }

    public function updateItem(Request $request, CartItem $item): JsonResource
    {
        $data = $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        [$cart] = $this->resolveCart($request);
        abort_unless($item->cart_id === $cart->id, 403);

        $item->update(['quantity' => $data['quantity']]);

        return CartResource::make($cart->load('items.product.images'));
    }

    public function removeItem(Request $request, CartItem $item): JsonResource
    {
        [$cart] = $this->resolveCart($request);
        abort_unless($item->cart_id === $cart->id, 403);

        $item->delete();

        return CartResource::make($cart->load('items.product.images'));
    }

    /**
     * @return array{0: Cart, 1: ?\Symfony\Component\HttpFoundation\Cookie}
     */
    private function resolveCart(Request $request, bool $createIfMissing = false): array
    {
        $user = $request->user();

        if ($user) {
            $cart = Cart::firstOrCreate(['user_id' => $user->id]);

            return [$cart, null];
        }

        $sessionToken = $request->cookie(self::COOKIE_NAME);
        $isNewToken = false;

        if (! $sessionToken) {
            $sessionToken = (string) \Illuminate\Support\Str::uuid();
            $isNewToken = true;
        }

        $cart = $createIfMissing || $isNewToken
            ? Cart::firstOrCreate(['session_token' => $sessionToken])
            : Cart::where('session_token', $sessionToken)->firstOrNew();

        $cookie = $isNewToken
            ? Cookie::make(self::COOKIE_NAME, $sessionToken, self::COOKIE_MINUTES, sameSite: 'lax')
            : null;

        return [$cart, $cookie];
    }
}
