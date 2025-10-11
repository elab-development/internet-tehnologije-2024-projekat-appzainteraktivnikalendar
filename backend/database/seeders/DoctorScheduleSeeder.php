<?php

namespace Database\Seeders;

use App\Models\DoctorSchedule;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DoctorScheduleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 0; $i < 100; $i++) {
            try {
                DoctorSchedule::factory()->create();
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                // skip duplicates silently
                continue;
            }
        }
    }
}
