<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'order_number' => $this->order_number,
            'status' => $this->status,
            'payment_method' => $this->payment_method,
            'payment_status' => $this->payment_status,
            'subtotal' => (float) $this->subtotal,
            'delivery_fee' => (float) $this->delivery_fee,
            'discount_total' => (float) $this->discount_total,
            'grand_total' => (float) $this->grand_total,
            'shipping' => [
                'name' => $this->shipping_name,
                'phone' => $this->shipping_phone,
                'district' => $this->shipping_district,
                'upazila' => $this->shipping_upazila,
                'address' => $this->shipping_address,
            ],
            'customer_note' => $this->customer_note,
            'placed_at' => $this->placed_at,
            'items' => OrderItemResource::collection($this->whenLoaded('items')),
            'payments' => PaymentResource::collection($this->whenLoaded('payments')),
        ];
    }
}
