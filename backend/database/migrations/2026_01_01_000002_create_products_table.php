<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('name_en');
            $table->string('name_bn');
            $table->string('slug')->unique();
            $table->enum('subject', [
                'physics', 'chemistry', 'biology', 'math', 'ict', 'agriculture', 'bundle', 'assignment',
            ]);
            $table->enum('level', ['ssc', 'hsc'])->nullable();
            $table->unsignedTinyInteger('paper')->nullable(); // 1 or 2, null = single-paper subject
            $table->decimal('price_min', 10, 2);
            $table->decimal('price_max', 10, 2)->nullable();
            $table->decimal('original_price', 10, 2)->nullable();
            $table->boolean('best_seller')->default(false);
            $table->boolean('sold_out')->default(false);
            $table->text('description_en')->nullable();
            $table->text('description_bn')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['subject', 'level', 'paper']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
