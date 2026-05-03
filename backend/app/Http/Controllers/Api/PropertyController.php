<?php

namespace App\Http\Controllers\Api;

use App\Models\Property;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with(['images', 'negotiations.client', 'visits.client'])
            ->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'type' => ['nullable', 'string', 'max:100'],
            'status' => ['nullable', 'string', 'max:100'],
            'area' => ['nullable', 'numeric'],
            'bedrooms' => ['nullable', 'integer'],
            'parking_spaces' => ['nullable', 'integer'],
            'price' => ['nullable', 'numeric'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'images.*' => ['nullable', 'image', 'max:5120'],
        ]);

        $property = Property::create([
            ...$data,
            'company_id' => $request->user()->company_id,
            'type' => $data['type'] ?? 'Apartamento',
            'status' => $data['status'] ?? 'Disponível',
            'bedrooms' => $data['bedrooms'] ?? 0,
            'parking_spaces' => $data['parking_spaces'] ?? 0,
            'price' => $data['price'] ?? 0,
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('properties', 'public');

                $property->images()->create([
                    'path' => $path,
                    'original_name' => $image->getClientOriginalName(),
                    'is_cover' => $index === 0,
                ]);
            }
        }

        return response()->json(
            $property->load(['images', 'negotiations.client', 'visits.client']),
            201
        );
    }

    public function show(Property $property)
    {
        return response()->json(
            $property->load(['images', 'negotiations.client', 'visits.client'])
        );
    }

    public function update(Request $request, Property $property)
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'type' => ['sometimes', 'string', 'max:100'],
            'status' => ['sometimes', 'string', 'max:100'],
            'area' => ['nullable', 'numeric'],
            'bedrooms' => ['nullable', 'integer'],
            'parking_spaces' => ['nullable', 'integer'],
            'price' => ['nullable', 'numeric'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'images.*' => ['nullable', 'image', 'max:5120'],
        ]);

        $property->update($data);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                $path = $image->store('properties', 'public');

                $property->images()->create([
                    'path' => $path,
                    'original_name' => $image->getClientOriginalName(),
                    'is_cover' => false,
                ]);
            }
        }

        return response()->json(
            $property->load(['images', 'negotiations.client', 'visits.client'])
        );
    }

    public function destroy(Property $property)
    {
        foreach ($property->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        $property->delete();

        return response()->json([
            'message' => 'Imóvel removido com sucesso.',
        ]);
    }
}