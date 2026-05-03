<?php

namespace App\Http\Controllers\Api;

use App\Models\Property;
use Illuminate\Http\Request;
use App\Models\PropertyNegotiation;
use App\Http\Controllers\Controller;

class PropertyNegotiationController extends Controller
{
    public function index()
    {
        return PropertyNegotiation::with(['property', 'client'])->latest()->get();
    }

    public function store(Request $request, Property $property)
    {
        $data = $request->validate([
            'client_id' => ['nullable', 'exists:clients,id'],
            'stage' => ['required', 'string'],
            'progress' => ['nullable', 'integer'],
            'status' => ['nullable', 'string'],
        ]);

        $negotiation = PropertyNegotiation::create([
            'company_id' => $request->user()->company_id,
            'property_id' => $property->id,
            'client_id' => $data['client_id'] ?? null,
            'stage' => $data['stage'],
            'progress' => $data['progress'] ?? 0,
            'status' => $data['status'] ?? 'Ativo',
        ]);

        return response()->json(
            $negotiation->load(['property', 'client']),
            201
        );
    }

    public function show(PropertyNegotiation $negotiation)
    {
        return $negotiation->load(['property', 'client']);
    }

    public function update(Request $request, PropertyNegotiation $negotiation)
    {
        $data = $request->validate([
            'stage' => ['sometimes', 'string'],
            'progress' => ['nullable', 'integer'],
            'status' => ['nullable', 'string'],
        ]);

        $negotiation->update($data);

        return response()->json(
            $negotiation->load(['property', 'client'])
        );
    }

    public function destroy(PropertyNegotiation $negotiation)
    {
        $negotiation->delete();

        return response()->json([
            'message' => 'Negociação removida',
        ]);
    }
}