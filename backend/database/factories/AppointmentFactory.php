<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Appointment>
 */
class AppointmentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Appointment::class;

    public function definition()
    {
        $doctor = User::where('role', 'doctor')->inRandomOrder()->first();
        $patient = User::where('role', 'patient')->inRandomOrder()->first();
        $start = $this->faker->dateTimeBetween('+1 days', '+1 month');

        return [
            'doctor_id' => $doctor?->id,
            'patient_id' => $patient?->id,
            'start_time' => $start,
            'end_time' => (clone $start)->modify('+30 minutes'),
            'status' => $this->faker->randomElement(['scheduled', 'canceled', 'rejected', 'completed']),
            'note' => $this->faker->optional()->sentence,
        ];
    }
}
