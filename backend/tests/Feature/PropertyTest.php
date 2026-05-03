<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Property;
use Illuminate\Foundation\Testing\RefreshDatabase;

class PropertyTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_property(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/properties', [
                'title' => 'Apartamento Jardins',
                'type' => 'Apartamento',
                'status' => 'Disponível',
                'area' => 270.6,
                'bedrooms' => 3,
                'parking_spaces' => 1,
                'price' => 550000,
            ]);

        $response->assertCreated();

        $this->assertDatabaseHas('properties', [
            'title' => 'Apartamento Jardins',
            'company_id' => $user->company_id,
        ]);
    }

    public function test_user_cannot_see_other_company_properties(): void
    {
        /** @var \App\Models\User $user1 */
        $user1 = User::factory()->create();

        /** @var \App\Models\User $user2 */
        $user2 = User::factory()->create();

        Property::factory()->create([
            'company_id' => $user1->company_id,
        ]);

        $response = $this->actingAs($user2, 'sanctum')
            ->getJson('/api/properties');

        $this->assertCount(0, $response->json());
    }
}
