<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique(); // e.g. PK-20260708-0001
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->enum('status', ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'])
                ->default('pending');
            $table->enum('payment_method', ['cod', 'bkash', 'nagad', 'rocket']);
            $table->enum('payment_status', ['unpaid', 'partial', 'paid'])->default('unpaid');
            $table->decimal('subtotal', 10, 2);
            $table->decimal('delivery_fee', 10, 2)->default(0);
            $table->decimal('discount_total', 10, 2)->default(0);
            $table->decimal('grand_total', 10, 2);
            $table->foreignId('coupon_id')->nullable()->constrained()->nullOnDelete();
            $table->string('shipping_name');
            $table->string('shipping_phone');
            $table->string('shipping_district');
            $table->string('shipping_upazila')->nullable();
            $table->text('shipping_address');
            $table->text('customer_note')->nullable();
            $table->text('admin_note')->nullable();
            $table->timestamp('placed_at');
            $table->timestamps();
            $table->softDeletes();

            $table->index('status');
            $table->index('shipping_phone');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
