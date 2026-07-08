<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

/**
 * Mirrors the frontend's static catalogue in
 * practical-khata-ecommerce/lib/mock-data.ts so the API/admin panel start
 * with the exact same products already live on the storefront.
 */
class CatalogueSeeder extends Seeder
{
    public function run(): void
    {
        $ssc = Category::updateOrCreate(
            ['slug' => 'ssc-khata'],
            ['name_en' => 'SSC Practical Khata', 'name_bn' => 'SSC প্র্যাকটিক্যাল খাতা', 'sort_order' => 1]
        );

        $hsc = Category::updateOrCreate(
            ['slug' => 'hsc-khata'],
            ['name_en' => 'HSC Practical Khata', 'name_bn' => 'HSC প্র্যাকটিক্যাল খাতা', 'sort_order' => 2]
        );

        $fullSet = Category::updateOrCreate(
            ['slug' => 'full-set'],
            ['name_en' => 'Full Package & Assignments', 'name_bn' => 'ফুল প্যাকেজ ও অ্যাসাইনমেন্ট', 'sort_order' => 3]
        );

        $products = [
            // --- SSC (single-paper subjects) ---
            ['slug' => 'ssc-physics', 'name_en' => 'Physics', 'name_bn' => 'পদার্থবিজ্ঞান', 'price_min' => 310, 'subject' => 'physics', 'level' => 'ssc', 'category_id' => $ssc->id],
            ['slug' => 'ssc-chemistry', 'name_en' => 'Chemistry', 'name_bn' => 'রসায়ন', 'price_min' => 310, 'subject' => 'chemistry', 'level' => 'ssc', 'category_id' => $ssc->id],
            ['slug' => 'ssc-biology', 'name_en' => 'Biology', 'name_bn' => 'জীববিজ্ঞান', 'price_min' => 385, 'subject' => 'biology', 'level' => 'ssc', 'best_seller' => true, 'category_id' => $ssc->id],
            ['slug' => 'ssc-higher-math', 'name_en' => 'Higher Math', 'name_bn' => 'উচ্চতর গণিত', 'price_min' => 310, 'subject' => 'math', 'level' => 'ssc', 'category_id' => $ssc->id],
            ['slug' => 'ssc-ict', 'name_en' => 'ICT', 'name_bn' => 'আইসিটি', 'price_min' => 350, 'subject' => 'ict', 'level' => 'ssc', 'best_seller' => true, 'category_id' => $ssc->id],
            ['slug' => 'ssc-agriculture', 'name_en' => 'Agriculture Studies', 'name_bn' => 'কৃষিশিক্ষা', 'price_min' => 350, 'subject' => 'agriculture', 'level' => 'ssc', 'category_id' => $ssc->id],

            // --- HSC (two papers per subject) ---
            ['slug' => 'hsc-physics-1', 'name_en' => 'Physics 1st Paper', 'name_bn' => 'পদার্থবিজ্ঞান ১ম পত্র', 'price_min' => 310, 'subject' => 'physics', 'level' => 'hsc', 'paper' => 1, 'category_id' => $hsc->id],
            ['slug' => 'hsc-physics-2', 'name_en' => 'Physics 2nd Paper', 'name_bn' => 'পদার্থবিজ্ঞান ২য় পত্র', 'price_min' => 310, 'subject' => 'physics', 'level' => 'hsc', 'paper' => 2, 'category_id' => $hsc->id],
            ['slug' => 'hsc-chemistry-1', 'name_en' => 'Chemistry 1st Paper', 'name_bn' => 'রসায়ন ১ম পত্র', 'price_min' => 310, 'subject' => 'chemistry', 'level' => 'hsc', 'paper' => 1, 'category_id' => $hsc->id],
            ['slug' => 'hsc-chemistry-2', 'name_en' => 'Chemistry 2nd Paper', 'name_bn' => 'রসায়ন ২য় পত্র', 'price_min' => 310, 'subject' => 'chemistry', 'level' => 'hsc', 'paper' => 2, 'category_id' => $hsc->id],
            ['slug' => 'hsc-biology-1', 'name_en' => 'Biology 1st Paper', 'name_bn' => 'জীববিজ্ঞান ১ম পত্র', 'price_min' => 385, 'subject' => 'biology', 'level' => 'hsc', 'paper' => 1, 'best_seller' => true, 'category_id' => $hsc->id],
            ['slug' => 'hsc-biology-2', 'name_en' => 'Biology 2nd Paper', 'name_bn' => 'জীববিজ্ঞান ২য় পত্র', 'price_min' => 465, 'subject' => 'biology', 'level' => 'hsc', 'paper' => 2, 'best_seller' => true, 'category_id' => $hsc->id],
            ['slug' => 'hsc-math-1', 'name_en' => 'Higher Math 1st Paper', 'name_bn' => 'উচ্চতর গণিত ১ম পত্র', 'price_min' => 310, 'subject' => 'math', 'level' => 'hsc', 'paper' => 1, 'category_id' => $hsc->id],
            ['slug' => 'hsc-math-2', 'name_en' => 'Higher Math 2nd Paper', 'name_bn' => 'উচ্চতর গণিত ২য় পত্র', 'price_min' => 310, 'subject' => 'math', 'level' => 'hsc', 'paper' => 2, 'category_id' => $hsc->id],
            ['slug' => 'hsc-ict', 'name_en' => 'ICT', 'name_bn' => 'আইসিটি', 'price_min' => 350, 'subject' => 'ict', 'level' => 'hsc', 'best_seller' => true, 'category_id' => $hsc->id],
            ['slug' => 'hsc-agriculture', 'name_en' => 'Agriculture Studies', 'name_bn' => 'কৃষিশিক্ষা', 'price_min' => 350, 'subject' => 'agriculture', 'level' => 'hsc', 'category_id' => $hsc->id],

            // --- Full package & assignments ---
            ['slug' => 'full-package-pcmb-ict', 'name_en' => 'PCMB + ICT Full Package (Practical + Drawing)', 'name_bn' => 'PCMB + ICT ফুল প্যাকেজ (প্র্যাকটিক্যাল + ড্রয়িং)', 'price_min' => 3060, 'original_price' => 4500, 'subject' => 'bundle', 'category_id' => $fullSet->id],
            ['slug' => 'assignment', 'name_en' => 'Handwritten Assignment', 'name_bn' => 'হাতে লেখা অ্যাসাইনমেন্ট', 'price_min' => 700, 'subject' => 'assignment', 'category_id' => $fullSet->id],
            ['slug' => 'custom-order', 'name_en' => 'Custom Order (Any Khata)', 'name_bn' => 'কাস্টম অর্ডার (যেকোনো খাতা)', 'price_min' => 310, 'price_max' => 465, 'subject' => 'assignment', 'category_id' => $fullSet->id],
        ];

        foreach ($products as $product) {
            Product::updateOrCreate(['slug' => $product['slug']], $product);
        }
    }
}
