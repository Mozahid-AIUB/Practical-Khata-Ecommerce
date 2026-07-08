<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'session_token' => $this->session_token,
            'items' => CartItemResource::collection($this->whenLoaded('items')),
            'total_price' => $this->totalPrice(),
        ];
    }
}
