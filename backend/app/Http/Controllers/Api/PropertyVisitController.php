<?php

namespace App\Http\Controllers\Api;

use App\Models\Property;
use App\Models\PropertyVisit;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PropertyVisitController extends Controller
{
    public function index()
    {
        return PropertyVisit::with(['property', 'client'])
            ->latest()
            ->get();
    }

    public function store(Request $request, Property $property)
    {
        $data = $request->validate([
            'client_id' => ['nullable', 'exists:clients,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'scheduled_at' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'max:100'],
        ]);

        $visit = PropertyVisit::create([
            'company_id' => $request->user()->company_id,
            'property_id' => $property->id,
            'client_id' => $data['client_id'] ?? null,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'scheduled_at' => $data['scheduled_at'] ?? null,
            'status' => $data['status'] ?? 'Agendada',
        ]);

        return response()->json(
            $visit->load(['property', 'client']),
            201
        );
    }

    public function show(PropertyVisit $visit)
    {
        return response()->json(
            $visit->load(['property', 'client'])
        );
    }

    public function update(Request $request, PropertyVisit $visit)
    {
        $data = $request->validate([
            'client_id' => ['nullable', 'exists:clients,id'],
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'scheduled_at' => ['nullable', 'date'],
            'status' => ['nullable', 'string', 'max:100'],
        ]);

        $visit->update($data);

        return response()->json(
            $visit->load(['property', 'client'])
        );
    }

    public function destroy(PropertyVisit $visit)
    {
        $visit->delete();

        return response()->json([
            'message' => 'Visita removida com sucesso.',
        ]);
    }
}