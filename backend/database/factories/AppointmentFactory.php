<?php

namespace Database\Factories;

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
    public function definition(): array
    {
        $doctor = \App\Models\User::factory()->create(['role' => 'doctor']);
        $patient = \App\Models\User::factory()->create(['role' => 'patient']);

        return [
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
            'start_time' => $this->faker->dateTimeBetween('+1 days', '+2 days'),
            'end_time' => $this->faker->dateTimeBetween('+2 days', '+3 days'),
            'status' => $this->faker->randomElement(['scheduled', 'canceled', 'finished']),
            'note' => $this->faker->sentence(),
        ];
    }
}
