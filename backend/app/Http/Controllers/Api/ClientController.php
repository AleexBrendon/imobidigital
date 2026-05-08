<?php

namespace App\Http\Controllers\Api;

use App\Models\Activity;
use App\Models\Contract;
use App\Models\Document;
use App\Models\PropertyVisit;
use App\Models\Client;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ClientController extends Controller
{

    use AuthorizesRequests;

    public function index()
    {
        return ClientResource::collection(
            Client::latest()->paginate(10)
        );
    }

    public function store(StoreClientRequest $request)
    {

        $data = $request->validated();
        $data['company_id'] = $request->user()->company_id;

        $client = Client::create($data);

        Activity::create([
            'company_id' => auth()->user()->company_id,
            'user_id' => auth()->id(),
            'title' => 'Cliente adicionado',
            'description' => "Cliente {$client->name} foi cadastrado.",
            'type' => 'created',
            'subject_type' => Client::class,
            'subject_id' => $client->id,
        ]);

        return (new ClientResource($client))
            ->response()
            ->setStatusCode(201);
    }

    public function show(Client $client)
    {
        $this->authorize('view', $client);

        return new ClientResource($client);
    }

    public function update(UpdateClientRequest $request, Client $client)
    {
        $this->authorize('update', $client);

        $client->update($request->validated());

        Activity::create([
            'company_id' => auth()->user()->company_id,
            'user_id' => auth()->id(),
            'title' => 'Cliente atualizado',
            'description' => "Cliente {$client->name} foi atualizado.",
            'type' => 'updated',
            'subject_type' => Client::class,
            'subject_id' => $client->id,
        ]);

        return new ClientResource($client);
    }

    public function destroy(Client $client)
    {
        $this->authorize('delete', $client);

        Activity::create([
            'company_id' => auth()->user()->company_id,
            'user_id' => auth()->id(),
            'title' => 'Cliente excluído',
            'description' => "Cliente {$client->name} foi removido.",
            'type' => 'deleted',
            'subject_type' => Client::class,
            'subject_id' => $client->id,
        ]);

        $client->delete();

        return response()->json([
            'message' => 'Cliente removido com sucesso.',
        ]);
    }

    public function activities(Client $client)
    {
        $this->authorize('view', $client);

        return Activity::with('user')
            ->where('subject_type', Client::class)
            ->where('subject_id', $client->id)
            ->latest()
            ->get()
            ->map(fn($activity) => [
                'id' => $activity->id,
                'title' => $activity->title,
                'description' => $activity->description,
                'type' => $activity->type,
                'clientName' => $client->name,
                'userName' => $activity->user?->name ?? 'Sistema',
                'date' => $activity->created_at?->format('d/m/Y H:i'),
                'created_at' => $activity->created_at,
            ]);
    }

    public function documents(Client $client)
    {
        $this->authorize('view', $client);

        return Document::where('company_id', auth()->user()->company_id)
            ->where('client_id', $client->id)
            ->latest()
            ->get()
            ->map(fn($document) => [
                'id' => $document->id,
                'name' => $document->name,
                'type' => $document->type,
                'status' => $document->status,
                'mime_type' => $document->mime_type,
                'size' => $document->size,
                'validation_date' => $document->validation_date,
                'expiration_date' => $document->expiration_date,
                'created_at' => $document->created_at,
            ]);
    }

    public function contracts(Client $client)
    {
        $this->authorize('view', $client);

        return Contract::where('company_id', auth()->user()->company_id)
            ->where('client_id', $client->id)
            ->latest()
            ->get()
            ->map(fn($contract) => [
                'id' => $contract->id,
                'title' => $contract->title,
                'type' => $contract->type,
                'status' => $contract->status,
                'start_date' => $contract->start_date,
                'end_date' => $contract->end_date,
                'value' => $contract->value,
                'ai_value' => $contract->ai_value,
                'fee' => $contract->fee,
                'code' => $contract->code,
                'created_at' => $contract->created_at,
            ]);
    }

    public function properties(Client $client)
    {
        $this->authorize('view', $client);

        return PropertyVisit::with('property.images')
            ->where('company_id', auth()->user()->company_id)
            ->where('client_id', $client->id)
            ->latest()
            ->get()
            ->pluck('property')
            ->filter()
            ->unique('id')
            ->values()
            ->map(fn($property) => [
                'id' => $property->id,
                'title' => $property->title,
                'type' => $property->type,
                'status' => $property->status,
                'area' => $property->area,
                'bedrooms' => $property->bedrooms,
                'parking_spaces' => $property->parking_spaces,
                'price' => $property->price,
                'address' => $property->address,
                'city' => $property->city,
                'state' => $property->state,
                'image' => $property->images
                    ->sortByDesc('is_cover')
                    ->first()
                    ? asset('storage/' . $property->images->sortByDesc('is_cover')->first()->path)
                    : null,
            ]);
    }
}
