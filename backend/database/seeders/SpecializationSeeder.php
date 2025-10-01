<?php

namespace Database\Seeders;

use App\Models\Specialization;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SpecializationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Kreiramo po jednu specijalizaciju za svakog doktora
        $doctors = User::where('role', 'doctor')->get();

        foreach ($doctors as $doctor) {
            Specialization::factory()->create([
                'user_id' => $doctor->id,
            ]);
        }
    }
}
