<?php

namespace Database\Factories;

use App\Models\Specialization;
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
    protected $model = Specialization::class;

    protected $specializations = [
        'Kardiolog',
        'Ginekolog',
        'Dermatolog',
        'Neurolog',
        'Ortoped',
        'Oftalmolog',
        'Pedijatar',
        'Endokrinolog'
    ];

    public function definition()
    {
        return [
            'name' => $this->faker->unique()->randomElement($this->specializations),
        ];
    }
}
