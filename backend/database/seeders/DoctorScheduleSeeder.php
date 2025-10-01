<?php

namespace Database\Seeders;

use App\Models\DoctorSchedule;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DoctorScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Uzimamo sve doktore
        $doctors = User::where('role', 'doctor')->get();

        foreach ($doctors as $doctor) {
            // Svakom doktoru dajemo random 3 dana u nedelji
            foreach (['monday', 'wednesday', 'friday'] as $day) {
                DoctorSchedule::factory()->create([
                    'doctor_id' => $doctor->id,
                    'day_of_week' => $day,
                ]);
            }
        }
    }
}
