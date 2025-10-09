<?php

namespace Database\Factories;

use App\Models\DoctorSchedule;
use App\Models\User;
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
    protected $model = DoctorSchedule::class;

    public function definition()
    {
        $doctor = User::where('role', 'doctor')->inRandomOrder()->first();

        return [
            'doctor_id' => $doctor?->id,
            'day_of_week' => $this->faker->randomElement(['monday','tuesday','wednesday','thursday','friday','saturday','sunday']),
            'start_time' => $this->faker->time('H:i:s', '08:00'),
            'end_time' => $this->faker->time('H:i:s', '17:00'),
        ];
    }
}
