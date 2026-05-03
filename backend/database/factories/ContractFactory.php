<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Company;
use App\Models\Contract;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class ContractFactory extends Factory
{
    protected $model = Contract::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'client_id' => null,
            'property_id' => null,
            'title' => fake()->sentence(4),
            'type' => 'Aluguel',
            'status' => 'Pendente',
            'start_date' => now()->toDateString(),
            'end_date' => now()->addYear()->toDateString(),
            'value' => 5000,
            'ai_value' => 230,
            'fee' => 39,
            'code' => 'CTR-' . fake()->numerify('####'),
        ];
    }
}