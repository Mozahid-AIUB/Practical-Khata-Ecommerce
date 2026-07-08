<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'name_en',
        'name_bn',
        'slug',
        'subject',
        'level',
        'paper',
        'price_min',
        'price_max',
        'original_price',
        'best_seller',
        'sold_out',
        'description_en',
        'description_bn',
        'meta',
    ];

    protected $casts = [
        'price_min' => 'decimal:2',
        'price_max' => 'decimal:2',
        'original_price' => 'decimal:2',
        'best_seller' => 'boolean',
        'sold_out' => 'boolean',
        'paper' => 'integer',
        'meta' => 'array',
    ];

    protected $appends = ['discount_percent', 'cover_url'];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    /** mirrors lib/mock-data.ts discountPercent(product) on the frontend */
    public function getDiscountPercentAttribute(): ?int
    {
        if (! $this->original_price || bccomp((string) $this->original_price, (string) $this->price_min, 2) <= 0) {
            return null;
        }

        return (int) round((1 - ((float) $this->price_min / (float) $this->original_price)) * 100);
    }

    /** resolved URL of the primary product photo, falls back to the first image */
    public function getCoverUrlAttribute(): ?string
    {
        $primary = $this->images->firstWhere('is_primary', true) ?? $this->images->first();

        return $primary?->url;
    }

    public function scopeBestSellers(Builder $query): Builder
    {
        return $query->where('best_seller', true);
    }

    public function scopeBySubject(Builder $query, string $subject): Builder
    {
        return $query->where('subject', $subject);
    }

    public function scopeByLevel(Builder $query, string $level): Builder
    {
        return $query->where('level', $level);
    }

    public function scopeInCategory(Builder $query, string $categorySlug): Builder
    {
        return $query->whereHas('category', fn (Builder $q) => $q->where('slug', $categorySlug));
    }
}
