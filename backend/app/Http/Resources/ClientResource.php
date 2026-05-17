<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'phone' => $this->phone,
            'document' => $this->document,
            'type' => $this->type,
            'status' => $this->status,
            'image' => $this->image,
            'image_url' => $this->image ? asset('storage/' . $this->image) : null,
            'created_at' => $this->created_at,
        ];
    }
}
