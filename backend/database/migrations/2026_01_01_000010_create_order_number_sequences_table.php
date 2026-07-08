<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Backs Order::generateOrderNumber() with a lockable per-day row so
 * concurrent checkouts can't collide on the same order_number
 * (a plain "count today's orders" query is a race condition under load).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('order_number_sequences', function (Blueprint $table) {
            $table->date('date')->primary();
            $table->unsignedInteger('last_sequence')->default(0);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_number_sequences');
    }
};
