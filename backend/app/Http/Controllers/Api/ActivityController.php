<?php

namespace App\Http\Controllers\Api;

use App\Models\Activity;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with('user')
            ->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('subject_type')) {
            $query->where('subject_type', $request->subject_type);
        }

        if ($request->filled('subject_id')) {
            $query->where('subject_id', $request->subject_id);
        }

        return response()->json(
            $query
                ->limit(50)
                ->get()
                ->map(fn($activity) => [
                    'id' => $activity->id,
                    'type' => $this->normalizeType($activity->type),
                    'clientName' => $this->extractClientName($activity),
                    'userName' => $activity->user?->name ?? 'Sistema',
                    'date' => optional($activity->created_at)->format('d/m/Y H:i'),
                    'title' => $activity->title,
                    'description' => $activity->description,
                    'created_at' => $activity->created_at,
                ])
        );
    }

    private function normalizeType(?string $type): string
    {
        return match ($type) {
            'created', 'updated', 'deleted', 'document' => $type,
            default => 'document',
        };
    }

    private function extractClientName(Activity $activity): string
    {
        if ($activity->subject_type === \App\Models\Client::class && $activity->subject) {
            return $activity->subject->name;
        }

        if ($activity->description) {
            return str_replace([
                'Cliente ',
                ' foi cadastrado.',
                ' foi atualizado.',
                ' foi removido.',
            ], '', $activity->description);
        }

        return 'Cliente';
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['nullable', 'string', 'max:100'],
            'subject_id' => ['nullable', 'integer'],
            'subject_type' => ['nullable', 'string'],
        ]);

        $activity = Activity::create([
            'company_id' => $request->user()->company_id,
            'user_id' => $request->user()->id,
            'title' => $data['title'],
            'description' => $data['description'] ?? null,
            'type' => $data['type'] ?? 'info',
            'subject_id' => $data['subject_id'] ?? null,
            'subject_type' => $data['subject_type'] ?? null,
        ]);

        return response()->json($activity->load('user'), 201);
    }

    public function show(Activity $activity)
    {
        return response()->json($activity->load('user'));
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();

        return response()->json([
            'message' => 'Atividade removida com sucesso.',
        ]);
    }
}
