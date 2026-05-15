<?php

namespace App\Http\Controllers\Api;

use App\Models\Contract;
use App\Models\SignatureStep;
use App\Models\SignatureEvent;
use App\Models\ContractClause;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ContractController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $query = Contract::with([
            'client',
            'property',
            'clauses',
            'signatureSteps',
            'signatureEvents',
        ])->latest();

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $this->authorize('create', Contract::class);

        $data = $request->validate([
            'client_id' => ['nullable', 'exists:clients,id'],
            'property_id' => ['nullable', 'exists:properties,id'],

            'title' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:100'],

            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],

            'value' => ['nullable', 'numeric'],
            'ai_value' => ['nullable', 'numeric'],
            'fee' => ['nullable', 'numeric'],
            'code' => ['nullable', 'string', 'max:255'],

            'clauses' => ['nullable', 'array'],
            'clauses.*.title' => ['required_with:clauses', 'string'],
            'clauses.*.description' => ['nullable', 'string'],
            'clauses.*.status' => ['nullable', 'string'],

            'signature_steps' => ['nullable', 'array'],
            'signature_steps.*.label' => ['required_with:signature_steps', 'string'],
            'signature_steps.*.completed' => ['nullable', 'boolean'],

            'signature_events' => ['nullable', 'array'],
            'signature_events.*.time' => ['nullable', 'string'],
            'signature_events.*.title' => ['required_with:signature_events', 'string'],
            'signature_events.*.description' => ['nullable', 'string'],
            'signature_events.*.completed' => ['nullable', 'boolean'],
        ]);

        $companyId = $request->user()->company_id;

        $contract = Contract::create([
            'company_id' => $companyId,
            'client_id' => $data['client_id'] ?? null,
            'property_id' => $data['property_id'] ?? null,
            'title' => $data['title'],
            'type' => $data['type'] ?? 'Aluguel',
            'status' => $data['status'] ?? 'Pendente',
            'start_date' => $data['start_date'] ?? null,
            'end_date' => $data['end_date'] ?? null,
            'value' => $data['value'] ?? 0,
            'ai_value' => $data['ai_value'] ?? 0,
            'fee' => $data['fee'] ?? 0,
            'code' => $data['code'] ?? null,
        ]);

        foreach ($data['clauses'] ?? [] as $clause) {
            $contract->clauses()->create([
                'company_id' => $companyId,
                'title' => $clause['title'],
                'description' => $clause['description'] ?? null,
                'status' => $clause['status'] ?? 'pending',
            ]);
        }

        $signatureSteps = $data['signature_steps'] ?? [
            [
                'label' => 'Contrato criado',
                'completed' => true,
            ],
            [
                'label' => 'Enviado para assinatura',
                'completed' => false,
            ],
            [
                'label' => 'Assinado pelo cliente',
                'completed' => false,
            ],
            [
                'label' => 'Assinado pela imobiliária',
                'completed' => false,
            ],
            [
                'label' => 'Contrato finalizado',
                'completed' => false,
            ],
        ];

        foreach ($signatureSteps as $index => $step) {
            $contract->signatureSteps()->create([
                'company_id' => $companyId,
                'label' => $step['label'],
                'completed' => $step['completed'] ?? false,
                'order' => $index + 1,
            ]);
        }

        $signatureEvents = $data['signature_events'] ?? [
            [
                'time' => now()->format('H:i'),
                'title' => 'Contrato criado',
                'description' => 'Contrato iniciado no sistema.',
                'completed' => true,
            ],
        ];

        foreach ($signatureEvents as $event) {
            $contract->signatureEvents()->create([
                'company_id' => $companyId,
                'time' => $event['time'] ?? now()->format('H:i'),
                'title' => $event['title'],
                'description' => $event['description'] ?? null,
                'completed' => $event['completed'] ?? false,
            ]);
        }

        return response()->json(
            $contract->load([
                'client',
                'property',
                'clauses',
                'signatureSteps',
                'signatureEvents',
            ]),
            201
        );
    }

    public function show(Contract $contract)
    {
        $this->authorize('view', $contract);

        return response()->json(
            $contract->load([
                'client',
                'property',
                'clauses',
                'signatureSteps',
                'signatureEvents',
            ])
        );
    }

    public function update(Request $request, Contract $contract)
    {
        $this->authorize('update', $contract);

        $data = $request->validate([
            'client_id' => ['nullable', 'exists:clients,id'],
            'property_id' => ['nullable', 'exists:properties,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:100'],
            'status' => ['sometimes', 'string', 'max:100'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
            'value' => ['nullable', 'numeric'],
            'ai_value' => ['nullable', 'numeric'],
            'fee' => ['nullable', 'numeric'],
            'code' => ['nullable', 'string', 'max:255'],
        ]);

        $contract->update($data);

        return response()->json(
            $contract->load([
                'client',
                'property',
                'clauses',
                'signatureSteps',
                'signatureEvents',
            ])
        );
    }

    public function destroy(Contract $contract)
    {
        $this->authorize('delete', $contract);

        $contract->delete();

        return response()->json([
            'message' => 'Contrato removido com sucesso.',
        ]);
    }

    public function updateSignatureStep(Request $request, SignatureStep $signatureStep)
    {
        $data = $request->validate([
            'completed' => ['required', 'boolean'],
        ]);

        if ($signatureStep->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $signatureStep->update([
            'completed' => $data['completed'],
        ]);

        $eventTitle = $data['completed']
            ? 'Assinatura ' . $signatureStep->label
            : 'Assinatura removida: ' . $signatureStep->label;

        $eventDescription = $data['completed']
            ? 'Etapa assinada em ' . now()->format('d/m/Y H:i')
            : 'Etapa marcada como pendente em ' . now()->format('d/m/Y H:i');

        $event = SignatureEvent::create([
            'company_id' => $signatureStep->company_id,
            'contract_id' => $signatureStep->contract_id,
            'time' => now()->format('H:i'),
            'title' => $eventTitle,
            'description' => $eventDescription,
            'completed' => $data['completed'],
        ]);

        return response()->json([
            'step' => $signatureStep,
            'event' => $event,
        ]);
    }

    public function updateClauseStatus(Request $request, ContractClause $clause)
    {
        $data = $request->validate([
            'status' => ['required', 'in:approved,pending'],
        ]);

        if ($clause->company_id !== $request->user()->company_id) {
            abort(403);
        }

        $clause->update([
            'status' => $data['status'],
        ]);

        return response()->json($clause);
    }
}
