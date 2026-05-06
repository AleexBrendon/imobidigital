<?php

namespace App\Http\Controllers\Api;

use App\Models\Document;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DocumentController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request)
    {
        $query = Document::with('client')->latest();

        if ($request->filled('type') && $request->type !== 'Todos') {
            $query->where('type', $request->type);
        }

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $documents = $query->get();

        $documents->each->refreshStatus();

        return response()->json($documents->load('client'));
    }

    public function store(Request $request)
    {
        $this->authorize('create', Document::class);

        $data = $request->validate([
            'client_id' => ['nullable', 'exists:clients,id'],
            'validation_date' => ['nullable', 'date'],
            'expiration_date' => ['nullable', 'date'],
            'file' => ['required', 'file', 'max:10240'],
        ]);

        $file = $request->file('file');

        $extension = strtolower($file->getClientOriginalExtension());

        $type = match ($extension) {
            'pdf' => 'PDF',
            'doc', 'docx' => 'DOCX',
            'png', 'jpg', 'jpeg', 'webp' => 'Imagem',
            default => 'Arquivo',
        };

        $path = $file->store('documents', 'public');

        $document = Document::create([
            'company_id' => $request->user()->company_id,
            'client_id' => $data['client_id'] ?? null,
            'name' => $file->getClientOriginalName(),
            'type' => $type,
            'status' => 'pending',
            'file_path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'validation_date' => $data['validation_date'] ?? now()->toDateString(),
            'expiration_date' => $data['expiration_date'] ?? now()->addDays(30)->toDateString(),
        ]);

        $document->refreshStatus();

        return response()->json($document->load('client'), 201);
    }

    public function show(Document $document)
    {
        $this->authorize('view', $document);

        $document->refreshStatus();

        return response()->json($document->load('client'));
    }

    public function update(Request $request, Document $document)
    {
        $this->authorize('update', $document);

        $data = $request->validate([
            'client_id' => ['nullable', 'exists:clients,id'],
            'name' => ['sometimes', 'string'],
            'validation_date' => ['nullable', 'date'],
            'expiration_date' => ['nullable', 'date'],
        ]);

        $document->update($data);
        $document->refreshStatus();

        return response()->json($document->load('client'));
    }

    public function destroy(Document $document)
    {
        $this->authorize('delete', $document);

        Storage::disk('public')->delete($document->file_path);

        $document->delete();

        return response()->json([
            'message' => 'Documento removido com sucesso.',
        ]);
    }

    public function download(Document $document)
    {
        $this->authorize('view', $document);

        if (! Storage::disk('public')->exists($document->file_path)) {
            return response()->json([
                'message' => 'Arquivo não encontrado.',
            ], 404);
        }

        return Storage::disk('public')->download(
            $document->file_path,
            $document->name
        );
    }
}