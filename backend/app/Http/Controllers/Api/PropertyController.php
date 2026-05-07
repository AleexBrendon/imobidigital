<?php

namespace App\Http\Controllers\Api;

use App\Models\Property;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class PropertyController extends Controller
{
    use AuthorizesRequests;

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

        return response()->json(
            $query->get()->map(fn($property) => $this->formatProperty($property))
        );
    }

    public function store(Request $request)
    {
        $this->authorize('create', Property::class);

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
            $this->formatProperty(
                $property->load(['images', 'negotiations.client', 'visits.client'])
            ),
            201
        );
    }

    public function show(Property $property)
    {
        $this->authorize('view', $property);

        return response()->json(
            $this->formatProperty(
                $property->load(['images', 'negotiations.client', 'visits.client'])
            )
        );
    }

    public function update(Request $request, Property $property)
    {
        $this->authorize('update', $property);

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
            $this->formatProperty(
                $property->load(['images', 'negotiations.client', 'visits.client'])
            )
        );
    }

    public function destroy(Property $property)
    {
        $this->authorize('delete', $property);

        foreach ($property->images as $image) {
            Storage::disk('public')->delete($image->path);
        }

        $property->delete();

        return response()->json([
            'message' => 'Imóvel removido com sucesso.',
        ]);
    }

    private function formatProperty(Property $property): array
    {
        return [
            'id' => $property->id,
            'title' => $property->title,
            'type' => $property->type,
            'status' => $property->status,
            'area' => $property->area ? $property->area . ' m²' : '0 m²',
            'bedrooms' => (int) $property->bedrooms,
            'parking_spaces' => (int) $property->parking_spaces,
            'price' => 'R$ ' . number_format((float) $property->price, 2, ',', '.'),
            'address' => $property->address,
            'city' => $property->city,
            'state' => $property->state,

            'images' => $property->images
                ->sortByDesc('is_cover')
                ->map(fn($image) => asset('storage/' . $image->path))
                ->values(),

            'negotiations' => $property->negotiations
                ->map(fn($negotiation) => [
                    'id' => $negotiation->id,
                    'property_id' => $negotiation->property_id,
                    'client_id' => $negotiation->client_id,
                    'name' => $negotiation->client?->name ?? 'Cliente não informado',
                    'stage' => $negotiation->stage,
                    'progress' => (int) $negotiation->progress,
                    'status' => $negotiation->status,
                    'color' => $negotiation->status === 'Perdido' ? 'red' : 'cyan',
                ])
                ->values(),

            'visits' => $property->visits
                ->map(fn($visit) => [
                    'id' => $visit->id,
                    'property_id' => $visit->property_id,
                    'client_id' => $visit->client_id,
                    'title' => $visit->title,
                    'description' => $visit->description,
                    'scheduled_at' => $visit->scheduled_at,
                    'status' => $visit->status,
                    'time' => $visit->scheduled_at
                        ? \Carbon\Carbon::parse($visit->scheduled_at)->format('d/m/Y H:i')
                        : 'Sem data',
                    'color' => $visit->status === 'Realizada' ? 'emerald' : 'violet',
                ])
                ->values(),
        ];
    }
}
