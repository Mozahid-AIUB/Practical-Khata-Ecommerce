<?php

use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\ProductController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — Phase 1 (catalogue) + Phase 2 (cart) + Phase 3 (checkout)
|--------------------------------------------------------------------------
| See docs/backend-architecture.md in the frontend repo for the full route
| plan (custom orders, auth, admin, etc.) — those land in later phases.
*/

Route::prefix('v1')->group(function () {
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{slug}/products', [CategoryController::class, 'products']);

    Route::get('products', [ProductController::class, 'index']);
    Route::get('products/top-sellers', [ProductController::class, 'topSellers']);
    Route::get('products/{slug}', [ProductController::class, 'show']);

    Route::get('cart', [CartController::class, 'show']);
    Route::post('cart/items', [CartController::class, 'addItem']);
    Route::patch('cart/items/{item}', [CartController::class, 'updateItem']);
    Route::delete('cart/items/{item}', [CartController::class, 'removeItem']);

    Route::post('orders', [OrderController::class, 'store']);
    Route::get('orders/track', [OrderController::class, 'track']);
});
