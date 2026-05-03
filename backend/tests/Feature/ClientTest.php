<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Client;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ClientTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_cannot_see_other_company_clients()
    {
        $user1 = User::factory()->createOne();
        /** @var User $user2 */
        $user2 = User::factory()->createOne();

        Client::factory()->create([
            'company_id' => $user1->company_id
        ]);

        $response = $this->actingAs($user2, 'sanctum')
            ->getJson('/api/clients');

        $this->assertCount(0, $response->json('data'));
    }

    public function test_user_can_create_client()
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/clients', [
                'name' => 'Maria Lima',
                'type' => 'Comprador',
                'status' => 'Lead',
            ]);

        $response->assertCreated();

        $this->assertDatabaseHas('clients', [
            'name' => 'Maria Lima',
            'company_id' => $user->company_id,
        ]);
    }

    public function test_user_can_update_client()
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $client = Client::factory()->create([
            'company_id' => $user->company_id
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->putJson("/api/clients/{$client->id}", [
                'name' => 'Atualizado',
            ]);

        $response->assertOk();

        $this->assertDatabaseHas('clients', [
            'id' => $client->id,
            'name' => 'Atualizado',
        ]);
    }

    public function test_user_can_delete_client()
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $client = Client::factory()->create([
            'company_id' => $user->company_id
        ]);

        $response = $this->actingAs($user, 'sanctum')
            ->deleteJson("/api/clients/{$client->id}");

        $response->assertOk();

        $this->assertDatabaseMissing('clients', [
            'id' => $client->id,
        ]);
    }
}
