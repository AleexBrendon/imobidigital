<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Company;
use Illuminate\Database\Eloquent\Factories\Factory;

class ClientFactory extends Factory
{
    protected $model = Client::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => fake()->phoneNumber(),
            'type' => fake()->randomElement(['Comprador', 'Locador', 'Locatário', 'Investidor']),
            'status' => fake()->randomElement(['Ativo', 'Inativo', 'Lead']),
        ];
    }
}