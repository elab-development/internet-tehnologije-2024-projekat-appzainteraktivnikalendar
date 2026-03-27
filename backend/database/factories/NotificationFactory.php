<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Notification>
 */
class NotificationFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    protected $model = Notification::class;

    public function definition()
    {
        $user = User::inRandomOrder()->first();

        return [
            'user_id' => $user?->id,
            'message' => $this->faker->sentence,
            'sent' => $this->faker->boolean(70),
        ];
    }
}
