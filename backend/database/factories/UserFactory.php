<?php

namespace Database\Factories;

use App\Models\Specialization;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;
    protected $model = User::class;

    public function definition()
    {
        // Weighted random role
        $random = $this->faker->numberBetween(1, 100);
        if ($random <= 60) {
            $role = 'patient';
        } elseif ($random <= 95) {
            $role = 'doctor';
        } else {
            $role = 'admin';
        }

        return [
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'email' => $this->faker->unique()->safeEmail(),
            'password' => Hash::make('password'),
            'role' => $role,
            'phone' => $this->faker->phoneNumber(),
            'specialty_id' => $role === 'doctor'
                ? Specialization::inRandomOrder()->first()?->id
                : null,
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn(array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
