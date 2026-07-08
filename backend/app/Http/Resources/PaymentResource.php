<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PaymentResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'method' => $this->method,
            'transaction_id' => $this->transaction_id,
            'sender_number' => $this->sender_number,
            'amount' => (float) $this->amount,
            'status' => $this->status,
            'verified_at' => $this->verified_at,
        ];
    }
}
