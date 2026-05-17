<?php

namespace App\Http\Controllers\Api;

use App\Models\PublicBotNotification;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PublicBotNotificationController extends Controller
{
    public function index(Request $request)
    {
        return PublicBotNotification::where('company_id', $request->user()->company_id)
            ->latest()
            ->get();
    }

    public function markAsRead(Request $request, PublicBotNotification $notification)
    {
        abort_if(
            $notification->company_id !== $request->user()->company_id,
            403
        );

        $notification->update([
            'read' => true,
        ]);

        return response()->json([
            'message' => 'Notificação marcada como lida.',
        ]);
    }
}
