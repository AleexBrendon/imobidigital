<?php

namespace Database\Factories;

use App\Models\Company;
use App\Models\Property;
use Illuminate\Database\Eloquent\Factories\Factory;

class PropertyFactory extends Factory
{
    protected $model = Property::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'title' => fake()->sentence(3),
            'type' => 'Apartamento',
            'status' => 'Disponível',
            'area' => 120.5,
            'bedrooms' => 3,
            'parking_spaces' => 1,
            'price' => 550000,
            'address' => fake()->streetAddress(),
            'city' => fake()->city(),
            'state' => 'SP',
        ];
    }
}