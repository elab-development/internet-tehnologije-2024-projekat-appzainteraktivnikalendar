<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\DoctorSchedule>
 */
class DoctorScheduleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // doctor_id se prosleđuje iz seeder-a
            'day_of_week' => $this->faker->randomElement(['monday','tuesday','wednesday','thursday','friday']),
            'start_time' => $this->faker->time('H:i', '09:00'),
            'end_time' => $this->faker->time('H:i', '17:00'),
        ];
    }
}
