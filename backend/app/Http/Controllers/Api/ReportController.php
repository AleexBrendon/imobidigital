<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\Contract;
use App\Models\Document;
use App\Models\Property;
use App\Http\Controllers\Controller;

class ReportController extends Controller
{
    public function index()
    {
        $contractsTotal = Contract::count();
        $signedContracts = Contract::where('status', 'Finalizado')->count();

        $documentsTotal = Document::count();
        $validatedDocuments = Document::where('status', 'Validado por IA')->count();
        $pendingDocuments = Document::where('status', 'Pendente')->count();

        $aiAccuracy = $documentsTotal > 0
            ? round(($validatedDocuments / $documentsTotal) * 100)
            : 0;

        return response()->json([
            'kpis' => [
                'clients' => Client::count(),
                'properties' => Property::count(),
                'contracts' => $contractsTotal,
                'documents' => $documentsTotal,
                'ai_accuracy' => $aiAccuracy,
                'pending_documents' => $pendingDocuments,
            ],

            'sales_performance' => [
                ['name' => 'Jan', 'sales' => 1200, 'rentals' => 900],
                ['name' => 'Fev', 'sales' => 2200, 'rentals' => 1400],
                ['name' => 'Mar', 'sales' => 1800, 'rentals' => 1600],
                ['name' => 'Abr', 'sales' => 3000, 'rentals' => 2200],
                ['name' => 'Mai', 'sales' => 3500, 'rentals' => 2600],
                ['name' => 'Jun', 'sales' => 2800, 'rentals' => 2400],
            ],

            'funnel' => [
                ['label' => 'Prospecção', 'value' => 100],
                ['label' => 'Visita', 'value' => 80],
                ['label' => 'Proposta', 'value' => 60],
                ['label' => 'Fechamento', 'value' => 40],
            ],

            'signed_contracts' => [
                ['name' => 'Assinados', 'value' => $signedContracts],
                ['name' => 'Pendentes', 'value' => max($contractsTotal - $signedContracts, 0)],
            ],

            'document_efficiency' => [
                [
                    'name' => 'Validados',
                    'value' => $validatedDocuments,
                    'percentage' => $aiAccuracy,
                ],
                [
                    'name' => 'Pendentes',
                    'value' => $pendingDocuments,
                    'percentage' => $documentsTotal > 0
                        ? round(($pendingDocuments / $documentsTotal) * 100)
                        : 0,
                ],
            ],
        ]);
    }
}