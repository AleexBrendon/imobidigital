<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ClientController extends Controller
{
    public function index()
    {
        return Client::latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required'],
            'email' => ['nullable', 'email'],
            'phone' => ['nullable'],
            'type' => ['required'],
            'status' => ['required'],
        ]);

        $data['company_id'] = Auth::user()->company_id;

        return Client::create($data);
    }

    public function show(Client $client)
    {
        return $client;
    }

    public function update(Request $request, Client $client)
    {
        $client->update($request->all());

        return $client;
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return response()->json([
            'message' => 'Cliente removido',
        ]);
    }
}