<?php

namespace Database\Factories;

use App\Models\DoctorSchedule;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class DoctorScheduleFactory extends Factory
{
    protected $model = DoctorSchedule::class;

    public function definition()
    {
        $doctor = User::where('role', 'doctor')->inRandomOrder()->first();

        $startHour = $this->faker->numberBetween(7, 18);
        $startMinute = $this->faker->randomElement([0, 30]);
        $carbonStart = Carbon::today()->setTime($startHour, $startMinute);
        $maxIncrements = (19 - $startHour) * 2;
        $increments = $this->faker->numberBetween(1, $maxIncrements > 0 ? $maxIncrements : 1);
        $carbonEnd = $carbonStart->copy()->addMinutes($increments * 30);
        $capTime = Carbon::today()->setTime(19, 0, 0);

        if ($carbonEnd->greaterThan($capTime)) {
            $carbonEnd = $capTime;
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
            'start_time' => $carbonStart->format('H:i:s'),
            'end_time' => $carbonEnd->format('H:i:s'),
        ];
    }
}
