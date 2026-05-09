<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\Contract;
use App\Models\Document;
use App\Models\Activity;
use App\Models\Property;
use App\Models\Notification;
use App\Models\SignatureStep;
use App\Models\PropertyNegotiation;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $companyId = $request->user()->company_id;

        $documents = Document::where('company_id', $companyId)->count();

        $validatedDocs = Document::where('company_id', $companyId)
            ->whereIn('status', ['valid', 'validated', 'approved', 'Validado por IA'])
            ->count();

        $pendingDocs = Document::where('company_id', $companyId)
            ->whereIn('status', ['pending', 'Pendente'])
            ->count();

        $aiAccuracy = $documents > 0
            ? round(($validatedDocs / $documents) * 100)
            : 0;

        return response()->json([
            'kpis' => [
                'clients' => Client::where('company_id', $companyId)->count(),
                'properties' => Property::where('company_id', $companyId)->count(),
                'contracts' => Contract::where('company_id', $companyId)->count(),
                'documents' => $documents,
                'ai_accuracy' => $aiAccuracy,
                'pending_documents' => $pendingDocs,
            ],

            'kanban' => $this->kanban($companyId),

            'activities' => $this->activities($companyId),

            'documents' => $this->documents($companyId),

            'contracts' => $this->contracts($companyId),

            'notifications' => [
                'unread' => Notification::where('company_id', $companyId)
                    ->where('is_read', false)
                    ->count(),

                'items' => Notification::where('company_id', $companyId)
                    ->latest()
                    ->limit(5)
                    ->get(),
            ],

            'signature_timeline' => $this->signatureTimeline($companyId),
        ]);
    }

    private function kanban(int $companyId)
    {
        $negotiations = PropertyNegotiation::with(['client', 'property'])
            ->where('company_id', $companyId)
            ->latest()
            ->get();

        return [
            'lead' => $this->mapKanbanClients(
                $negotiations->whereIn('stage', ['Lead', 'Prospecção'])
            ),

            'ativo' => $this->mapKanbanClients(
                $negotiations->whereIn('stage', ['Ativo', 'Visita'])
            ),

            'negociacao' => $this->mapKanbanClients(
                $negotiations->whereIn('stage', ['Em negociação', 'Proposta'])
            ),

            'fechado' => $this->mapKanbanClients(
                $negotiations->whereIn('stage', ['Fechado', 'Fechamento'])
            ),
        ];
    }

    private function mapKanbanClients($negotiations)
    {
        return $negotiations
            ->filter(fn($negotiation) => $negotiation->client)
            ->values()
            ->map(function ($negotiation) {
                return [
                    'id' => $negotiation->id,
                    'client_id' => $negotiation->client?->id,
                    'name' => $negotiation->client?->name ?? 'Cliente sem nome',
                    'email' => $negotiation->client?->email,
                    'phone' => $negotiation->client?->phone,
                    'tag' => $negotiation->stage,
                    'stage' => $negotiation->stage,
                    'avatar' => $negotiation->client?->id,
                    'property' => $negotiation->property?->title,
                    'progress' => $negotiation->progress ?? 0,
                ];
            });
    }

    private function activities(int $companyId)
    {
        return Activity::where('company_id', $companyId)
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'title' => $activity->title,
                    'description' => $activity->description,
                    'type' => $activity->type,
                    'created_at' => $activity->created_at,
                ];
            });
    }

    private function documents(int $companyId)
    {
        return Document::where('company_id', $companyId)
            ->latest()
            ->limit(6)
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'name' => $document->name,
                    'type' => $document->type,
                    'status' => $this->documentStatusLabel($document->status),
                    'color' => $this->documentStatusColor($document->status),
                ];
            });
    }

    private function contracts(int $companyId)
    {
        return Contract::where('company_id', $companyId)
            ->whereNotNull('end_date')
            ->orderBy('end_date')
            ->limit(5)
            ->get()
            ->map(function ($contract) {
                $progress = 100;

                if ($contract->start_date && $contract->end_date) {
                    $start = strtotime($contract->start_date);
                    $end = strtotime($contract->end_date);
                    $now = time();

                    if ($end > $start) {
                        $progress = round((($now - $start) / ($end - $start)) * 100);
                        $progress = max(0, min(100, $progress));
                    }
                }

                return [
                    'id' => $contract->id,
                    'title' => $contract->title,
                    'progress' => $progress,
                    'status' => $contract->status,
                    'end_date' => $contract->end_date,
                ];
            });
    }

    private function signatureTimeline(int $companyId)
    {
        $contract = Contract::where('company_id', $companyId)
            ->latest()
            ->first();

        if (! $contract) {
            return null;
        }

        $steps = SignatureStep::where('company_id', $companyId)
            ->where('contract_id', $contract->id)
            ->orderBy('order')
            ->get();

        $completed = $steps->where('completed', true)->count();

        return [
            'contract' => $contract->title,
            'code' => $contract->code ?? 'SH:' . $contract->id,
            'progress' => $steps->count() > 0
                ? round(($completed / $steps->count()) * 100)
                : 0,
            'steps' => $steps->map(function ($step) {
                return [
                    'label' => $step->label,
                    'completed' => (bool) $step->completed,
                ];
            }),
        ];
    }

    private function documentStatusLabel(string $status): string
    {
        return match ($status) {
            'valid' => 'Válido',
            'pending' => 'Pendente',
            'expired' => 'Vencido',
            'validated' => 'Validado',
            'approved' => 'Aprovado',
            'Validado por IA' => 'Validado por IA',
            'Pendente' => 'Pendente',
            default => $status,
        };
    }

    private function documentStatusColor(string $status): string
    {
        return match ($status) {
            'valid', 'validated', 'approved', 'Validado por IA' => 'emerald',
            'pending', 'Pendente' => 'yellow',
            'expired' => 'red',
            default => 'cyan',
        };
    }
}
