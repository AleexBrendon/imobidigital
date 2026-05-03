<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\Contract;
use App\Models\Document;
use App\Models\Activity;
use App\Models\Property;
use App\Models\Notification;
use App\Models\PropertyNegotiation;
use App\Http\Controllers\Controller;

class DashboardController extends Controller
{
    public function index()
    {
        // KPIs
        $clients = Client::count();
        $properties = Property::count();
        $contracts = Contract::count();
        $documents = Document::count();

        // Documentos
        $validatedDocs = Document::where('status', 'Validado por IA')->count();
        $pendingDocs = Document::where('status', 'Pendente')->count();

        $aiAccuracy = $documents > 0
            ? round(($validatedDocs / $documents) * 100)
            : 0;

        // Kanban (negociações agrupadas por stage)
        $kanban = PropertyNegotiation::with(['client', 'property'])
            ->get()
            ->groupBy('stage');

        // Atividades recentes
        $activities = Activity::with('user')
            ->latest()
            ->limit(5)
            ->get();

        // Documentos recentes
        $recentDocuments = Document::with('client')
            ->latest()
            ->limit(5)
            ->get();

        // Contratos recentes
        $recentContracts = Contract::with(['client', 'property'])
            ->latest()
            ->limit(5)
            ->get();

        // Notificações
        $notifications = Notification::latest()
            ->limit(5)
            ->get();

        return response()->json([
            'kpis' => [
                'clients' => $clients,
                'properties' => $properties,
                'contracts' => $contracts,
                'documents' => $documents,
                'ai_accuracy' => $aiAccuracy,
                'pending_documents' => $pendingDocs,
            ],

            'kanban' => $kanban,

            'activities' => $activities,

            'documents' => $recentDocuments,

            'contracts' => $recentContracts,

            'notifications' => [
                'unread' => Notification::where('is_read', false)->count(),
                'items' => $notifications,
            ],
        ]);
    }
}