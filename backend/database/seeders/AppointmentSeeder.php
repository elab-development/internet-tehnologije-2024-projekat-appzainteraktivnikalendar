<?php

namespace Database\Seeders;

use App\Models\Appointment;
use Illuminate\Database\Seeder;

class AppointmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $count = 100; // number of appointments you want

        $created = 0;
        $attempts = 0;

        while ($created < $count && $attempts < $count * 5) { // try up to 5x to avoid infinite loop
            try {
                $appointment = Appointment::factory()->create();
                $created++;
            } catch (\Exception $e) {
                // skip failures (e.g., no free slots), just continue
            }
            $attempts++;
        }

        $this->command->info("Created $created appointments after $attempts attempts.");
    }
}
