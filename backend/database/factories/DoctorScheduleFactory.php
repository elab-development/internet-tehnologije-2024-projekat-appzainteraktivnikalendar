<?php

namespace Database\Factories;

use App\Models\DoctorSchedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class DoctorScheduleFactory extends Factory
{
    protected $model = DoctorSchedule::class;

    public function definition()
    {
        $doctor = User::where('role', 'doctor')->inRandomOrder()->first();

        // allowed hours (07:00 to 19:00)
        $startHour = $this->faker->numberBetween(7, 18); // latest start at 18:30
        $startMinute = $this->faker->randomElement([0, 30]);
        $start = sprintf('%02d:%02d:00', $startHour, $startMinute);

        // generate end time (must be after start)
        // pick a random number of 30-min increments, at least 1
        $increments = $this->faker->numberBetween(1, (19 - $startHour) * 2);
        $endTimestamp = strtotime($start) + ($increments * 30 * 60);
        $end = date('H:i:s', $endTimestamp);

        // cap at 19:00 if it goes over
        if (strtotime($end) > strtotime('19:00:00')) {
            $end = '19:00:00';
        }

        return [
            'doctor_id' => $doctor?->id,
            'day_of_week' => $this->faker->randomElement([
                'monday',
                'tuesday',
                'wednesday',
                'thursday',
                'friday',
                'saturday',
                'sunday'
            ]),
            'start_time' => $start,
            'end_time' => $end,
        ];
    }
}
