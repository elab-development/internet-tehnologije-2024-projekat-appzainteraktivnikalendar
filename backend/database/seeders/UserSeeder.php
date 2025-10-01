<?php

namespace Database\Seeders;

use App\Models\DoctorSchedule;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Admin
        User::factory()->create([
            'role' => 'admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('admin123'),
        ]);

        // 5 Doktora
        User::factory()->count(5)->create([
            'role' => 'doctor',
        ]);

        // 10 Pacijenata
        User::factory()->count(10)->create([
            'role' => 'patient',
        ]);
    }
}
