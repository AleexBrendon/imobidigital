<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Contract;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ContractTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_contract(): void
    {
        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/contracts', [
                'title' => 'Contrato de Aluguel',
                'type' => 'Aluguel',
                'status' => 'Pendente',
                'value' => 5000,
                'clauses' => [
                    [
                        'title' => 'Cláusula de aluguel',
                        'status' => 'approved',
                    ],
                ],
                'signature_steps' => [
                    [
                        'label' => 'Locador',
                        'completed' => true,
                    ],
                ],
            ]);

        $response->assertCreated();

        $this->assertDatabaseHas('contracts', [
            'title' => 'Contrato de Aluguel',
            'company_id' => $user->company_id,
        ]);

        $this->assertDatabaseHas('contract_clauses', [
            'title' => 'Cláusula de aluguel',
            'company_id' => $user->company_id,
        ]);
    }

    public function test_user_cannot_see_other_company_contracts(): void
    {
        /** @var \App\Models\User $user1 */
        $user1 = User::factory()->create();

        /** @var \App\Models\User $user2 */
        $user2 = User::factory()->create();

        Contract::factory()->create([
            'company_id' => $user1->company_id,
        ]);

        $response = $this->actingAs($user2, 'sanctum')
            ->getJson('/api/contracts');

        $this->assertCount(0, $response->json());
    }
}
