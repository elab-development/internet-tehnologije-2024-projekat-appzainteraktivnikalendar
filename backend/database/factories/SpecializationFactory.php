<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Specialization>
 */
class SpecializationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            // user_id se prosleđuje iz seeder-a
            'name' => $this->faker->randomElement([
                'Kardiolog',
                'Dermatolog',
                'Pedijatar',
                'Oftalmolog',
                'Ortoped',
                'Psihijatar',
                'Stomatolog'
            ]),
        ];
    }
}
