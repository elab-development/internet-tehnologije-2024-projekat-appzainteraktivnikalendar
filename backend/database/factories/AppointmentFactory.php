<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\User;
use App\Models\DoctorSchedule;
use Illuminate\Database\Eloquent\Factories\Factory;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition()
    {
        // 1. Pick a random doctor schedule first
        $schedule = DoctorSchedule::inRandomOrder()->first();
        if (!$schedule) {
            throw new \Exception('No doctor schedules found.');
        }

        $doctor = User::find($schedule->doctor_id);
        if (!$doctor) {
            throw new \Exception('Doctor not found for schedule ' . $schedule->id);
        }

        // 2. Pick a random patient
        $patient = User::where('role', 'patient')->inRandomOrder()->first();
        if (!$patient) {
            throw new \Exception('No patients found.');
        }

        // 3. Pick a date that matches the schedule day
        $dayOfWeek = $schedule->day_of_week;
        $date = $this->faker->dateTimeBetween('next ' . ucfirst($dayOfWeek), '+1 month');

        // 4. Generate available slots
        $startTime = $schedule->start_time->getTimestamp();
        $endTime = $schedule->end_time->getTimestamp();

        $existingAppointments = Appointment::where('doctor_id', $doctor->id)
            ->whereDate('start_time', $date)
            ->pluck('start_time')
            ->map(fn($t) => $t->format('H:i'))
            ->toArray();

        $slots = [];
        for ($t = $startTime; $t + 30 * 60 <= $endTime; $t += 30 * 60) {
            $slot = date('H:i', $t);
            if (!in_array($slot, $existingAppointments)) {
                $slots[] = $t;
            }
        }

        if (empty($slots)) {
            // pick the first available date in the next month for this schedule
            // or throw an exception if you want stricter control
            return $this->definition(); // retry recursively
        }

        // 5. Pick a random free slot
        $slot = $this->faker->randomElement($slots);
        $start = (clone $date)->setTime(date('H', $slot), date('i', $slot));
        $end = (clone $start)->modify('+30 minutes');

        return [
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
            'start_time' => $start,
            'end_time' => $end,
            'status' => $this->faker->randomElement(['scheduled', 'canceled', 'rejected', 'completed']),
            'note' => $this->faker->optional()->sentence,
        ];
    }
}
