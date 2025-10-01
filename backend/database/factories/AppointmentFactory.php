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
            // doctor_id i patient_id se prosleđuju iz seeder-a
            'start_time' => $this->faker->dateTimeBetween('+1 days', '+10 days'),
            'end_time' => $this->faker->dateTimeBetween('+1 days', '+10 days'),
            'status' => $this->faker->randomElement(['scheduled','canceled','finished']),
            'note' => $this->faker->sentence(),
        ];
    }
}
