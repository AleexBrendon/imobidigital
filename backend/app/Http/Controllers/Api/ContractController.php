<?php

namespace App\Http\Controllers\Api;

use App\Models\Contract;
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

        foreach ($data['signature_steps'] ?? [] as $index => $step) {
            $contract->signatureSteps()->create([
                'company_id' => $companyId,
                'label' => $step['label'],
                'completed' => $step['completed'] ?? false,
                'order' => $index,
            ]);
        }

        foreach ($data['signature_events'] ?? [] as $event) {
            $contract->signatureEvents()->create([
                'company_id' => $companyId,
                'time' => $event['time'] ?? null,
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
}
