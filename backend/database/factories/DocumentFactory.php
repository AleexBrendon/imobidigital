<?php

namespace Database\Factories;

use App\Models\Client;
use App\Models\Company;
use App\Models\Document;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition(): array
    {
        return [
            'company_id' => Company::factory(),
            'client_id' => null,
            'name' => fake()->word() . '.pdf',
            'type' => 'PDF',
            'status' => 'Pendente',
            'file_path' => 'documents/fake.pdf',
            'mime_type' => 'application/pdf',
            'size' => 1024,
            'validation_date' => now()->toDateString(),
            'expiration_date' => now()->addDays(30)->toDateString(),
        ];
    }
}