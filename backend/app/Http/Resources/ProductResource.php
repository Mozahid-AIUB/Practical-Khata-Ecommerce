<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'slug' => $this->slug,
            'name' => [
                'en' => $this->name_en,
                'bn' => $this->name_bn,
            ],
            'category' => $this->whenLoaded('category', fn () => $this->category->slug),
            'subject' => $this->subject,
            'level' => $this->level,
            'paper' => $this->paper,
            'price_min' => (float) $this->price_min,
            'price_max' => $this->price_max !== null ? (float) $this->price_max : null,
            'original_price' => $this->original_price !== null ? (float) $this->original_price : null,
            'discount_percent' => $this->discount_percent,
            'best_seller' => $this->best_seller,
            'sold_out' => $this->sold_out,
            'cover_url' => $this->cover_url,
        ];
    }
}
