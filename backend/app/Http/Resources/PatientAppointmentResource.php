<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PatientAppointmentResource extends JsonResource
{
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
                'email' => $this->doctor->email,
                'phone' => $this->doctor->phone,
                'specialization' => [
                    'id' => $this->doctor->specialization->id ?? null,
                    'name' => $this->doctor->specialization->name ?? null,
                ],
            ],
        ];
    }
}