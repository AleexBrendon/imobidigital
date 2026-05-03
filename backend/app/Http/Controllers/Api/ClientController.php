<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
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

        return new ClientResource($client);
    }

    public function destroy(Client $client)
    {
        $this->authorize('delete', $client);

        $client->delete();

        return response()->json([
            'message' => 'Cliente removido com sucesso.',
        ]);
    }
}
