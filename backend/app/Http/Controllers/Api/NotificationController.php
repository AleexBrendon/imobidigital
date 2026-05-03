<?php

namespace App\Http\Controllers\Api;

use App\Models\Notification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        $query = Notification::latest();

        if ($request->boolean('unread')) {
            $query->where('is_read', false);
        }

        return response()->json([
            'unread_count' => Notification::where('is_read', false)->count(),
            'data' => $query->limit(50)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'user_id' => ['nullable', 'exists:users,id'],
            'title' => ['required', 'string', 'max:255'],
            'message' => ['nullable', 'string'],
            'type' => ['nullable', 'string', 'max:100'],
            'subject_id' => ['nullable', 'integer'],
            'subject_type' => ['nullable', 'string'],
        ]);

        $notification = Notification::create([
            'company_id' => $request->user()->company_id,
            'user_id' => $data['user_id'] ?? null,
            'title' => $data['title'],
            'message' => $data['message'] ?? null,
            'type' => $data['type'] ?? 'info',
            'subject_id' => $data['subject_id'] ?? null,
            'subject_type' => $data['subject_type'] ?? null,
        ]);

        return response()->json($notification, 201);
    }

    public function show(Notification $notification)
    {
        return response()->json($notification);
    }

    public function markAsRead(Notification $notification)
    {
        $notification->update([
            'is_read' => true,
        ]);

        return response()->json($notification);
    }

    public function markAllAsRead(Request $request)
    {
        Notification::where('company_id', $request->user()->company_id)
            ->where('is_read', false)
            ->update(['is_read' => true]);

        return response()->json([
            'message' => 'Todas as notificações foram marcadas como lidas.',
        ]);
    }

    public function destroy(Notification $notification)
    {
        $notification->delete();

        return response()->json([
            'message' => 'Notificação removida com sucesso.',
        ]);
    }
}