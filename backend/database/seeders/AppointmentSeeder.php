<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $doctors = User::where('role', 'doctor')->get();
        $patients = User::where('role', 'patient')->get();

        foreach ($doctors as $doctor) {
            foreach ($patients->random(3) as $patient) {
                Appointment::factory()->create([
                    'doctor_id' => $doctor->id,
                    'patient_id' => $patient->id,
                    'start_time' => Carbon::now()->addDays(rand(1, 10))->setHour(rand(8, 15)),
                    'end_time'   => Carbon::now()->addDays(rand(1, 10))->setHour(rand(16, 20)),
                    'status'     => 'scheduled',
                ]);
            }
        }
    }
}
