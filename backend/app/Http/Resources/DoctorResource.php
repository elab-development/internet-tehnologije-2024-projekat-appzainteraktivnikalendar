<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DoctorResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $appointmentsCount = $this->appointmentsAsDoctor()
            ->selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status');

        return [
            'id' => $this->id,
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'phone' => $this->phone,
            'specialization' => $this->specialization?->name,
            'doctor_schedules' => $this->doctorSchedules->map(function ($schedule) {
                return [
                    'day_of_week' => $schedule->day_of_week,
                    'start_time' => $schedule->start_time->format('H:i'),
                    'end_time' => $schedule->end_time->format('H:i'),
                ];
            }),
            'appointments_stats' => [
                'total' => $this->appointmentsAsDoctor()->count(),
                'scheduled' => $appointmentsCount->get('scheduled', 0),
                'completed' => $appointmentsCount->get('completed', 0),
                'rejected' => $appointmentsCount->get('rejected', 0),
                'canceled' => $appointmentsCount->get('canceled', 0),
                'distinct_patients' => $this->appointmentsAsDoctor()->distinct('patient_id')->count('patient_id'),
            ],
        ];
    }
}
