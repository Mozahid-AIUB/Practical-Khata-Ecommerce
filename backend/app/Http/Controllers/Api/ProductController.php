<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::query()->with(['images', 'category']);

        if ($request->filled('subject')) {
            $query->bySubject($request->string('subject'));
        }

        if ($request->filled('level')) {
            $query->byLevel($request->string('level'));
        }

        if ($request->filled('paper')) {
            $query->where('paper', $request->integer('paper'));
        }

        if ($request->filled('category')) {
            $query->inCategory($request->string('category'));
        }

        if ($request->boolean('best_seller')) {
            $query->bestSellers();
        }

        return ProductResource::collection($query->get());
    }

    public function show(string $slug): JsonResource
    {
        $product = Product::with(['images', 'category'])
            ->where('slug', $slug)
            ->firstOrFail();

        return ProductResource::make($product);
    }

    /** mirrors getTopSellers() in lib/mock-data.ts */
    public function topSellers(): AnonymousResourceCollection
    {
        return ProductResource::collection(
            Product::with(['images', 'category'])->bestSellers()->get()
        );
    }
}
