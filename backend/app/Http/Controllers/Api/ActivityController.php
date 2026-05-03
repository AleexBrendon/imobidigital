<?php

namespace App\Http\Controllers\Api;

use App\Models\Activity;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $query = Activity::with('user')->latest();

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return response()->json($query->limit(50)->get());
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