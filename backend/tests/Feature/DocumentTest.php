<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Document;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Testing\RefreshDatabase;

class DocumentTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_upload_document(): void
    {
        Storage::fake('public');

        /** @var \App\Models\User $user */
        $user = User::factory()->create();

        $response = $this->actingAs($user, 'sanctum')
            ->postJson('/api/documents', [
                'file' => UploadedFile::fake()->create('contrato.pdf', 100, 'application/pdf'),
                'status' => 'Pendente',
            ]);

        $response->assertCreated();

        $this->assertDatabaseHas('documents', [
            'company_id' => $user->company_id,
            'name' => 'contrato.pdf',
        ]);
    }

    public function test_user_cannot_see_other_company_documents(): void
    {
        /** @var \App\Models\User $user1 */
        $user1 = User::factory()->create();

        /** @var \App\Models\User $user2 */
        $user2 = User::factory()->create();

        Document::factory()->create([
            'company_id' => $user1->company_id,
        ]);

        $response = $this->actingAs($user2, 'sanctum')
            ->getJson('/api/documents');

        $this->assertCount(0, $response->json());
    }
}
