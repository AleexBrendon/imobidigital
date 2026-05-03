<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Company;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'document' => fake()->numerify('###########'),
            'role' => 'admin',
            'password' => Hash::make('password'),
            'email_verified_at' => now(),
        ];
    }
}