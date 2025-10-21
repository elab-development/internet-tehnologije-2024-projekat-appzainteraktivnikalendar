<?php

namespace Database\Factories;

use App\Models\Appointment;
use App\Models\User;
use App\Models\DoctorSchedule;
use Illuminate\Database\Eloquent\Factories\Factory;
use Carbon\Carbon;

class AppointmentFactory extends Factory
{
    protected $model = Appointment::class;

    public function definition()
    {
        $schedule = DoctorSchedule::inRandomOrder()->first();
        if (!$schedule) {
            throw new \Exception('No doctor schedules found.');
        }

        $doctor = User::find($schedule->doctor_id);
        if (!$doctor) {
            throw new \Exception('Doctor not found for schedule ' . $schedule->id);
        }

        $patient = User::where('role', 'patient')->inRandomOrder()->first();
        if (!$patient) {
            throw new \Exception('No patients found.');
        }

        $dayOfWeek = $schedule->day_of_week;

        // Randomly decide between past and future appointment
        $isPast = $this->faker->boolean(40);

        if ($isPast) {
            // Past date within the last month
            $date = $this->faker->dateTimeBetween('-1 month', 'last ' . ucfirst($dayOfWeek));
        } else {
            // Future date within the next month
            $date = $this->faker->dateTimeBetween('next ' . ucfirst($dayOfWeek), '+1 month');
        }

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
            return $this->definition(); // retry recursively
        }

        $slot = $this->faker->randomElement($slots);
        $start = (clone $date)->setTime(date('H', $slot), date('i', $slot));
        $end = (clone $start)->modify('+30 minutes');

        $now = Carbon::now();

        // Prevent "completed" if appointment is in the future
        if ($start > $now) {
            $statusOptions = ['scheduled', 'canceled', 'rejected'];
        } else {
            $statusOptions = ['scheduled', 'canceled', 'rejected', 'completed'];
        }

        return [
            'doctor_id' => $doctor->id,
            'patient_id' => $patient->id,
            'start_time' => $start,
            'end_time' => $end,
            'status' => $this->faker->randomElement($statusOptions),
            'note' => $this->faker->optional()->sentence,
        ];
    }
}
