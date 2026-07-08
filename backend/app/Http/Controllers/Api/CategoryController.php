<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Http\Resources\ProductResource;
use App\Models\Category;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class CategoryController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        return CategoryResource::collection(
            Category::orderBy('sort_order')->get()
        );
    }

    public function products(string $slug): AnonymousResourceCollection
    {
        $category = Category::where('slug', $slug)->firstOrFail();

        return ProductResource::collection(
            $category->products()->with('images')->get()
        );
    }
}
