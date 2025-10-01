<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AppointmentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'status' => $this->status,
            'note' => $this->note,
            'doctor' => [
                'id' => $this->doctor->id,
                'first_name' => $this->doctor->first_name,
                'last_name' => $this->doctor->last_name,
                'phone' => $this->doctor->phone,
                'specializations' => $this->doctor->specializations->pluck('name'),
            ],
        ];
    }
}
