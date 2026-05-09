<?php

namespace App\Http\Controllers\Api;

use App\Models\Client;
use App\Models\Contract;
use App\Models\Document;
use App\Models\Property;
use App\Models\SignatureStep;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index()
    {
        $companyId = auth()->user()->company_id;

        $contractsTotal = Contract::where('company_id', $companyId)->count();

        $documentsTotal = Document::where('company_id', $companyId)->count();

        $validatedDocuments = Document::where('company_id', $companyId)
            ->whereIn('status', ['valid', 'validated', 'approved'])
            ->count();

        $pendingDocuments = Document::where('company_id', $companyId)
            ->where('status', 'pending')
            ->count();

        $rejectedDocuments = Document::where('company_id', $companyId)
            ->whereIn('status', ['expired', 'rejected'])
            ->count();

        $documentAccuracy = $documentsTotal > 0
            ? round(($validatedDocuments / $documentsTotal) * 100)
            : 0;

        $pendingPercentage = $documentsTotal > 0
            ? round(($pendingDocuments / $documentsTotal) * 100)
            : 0;

        $totalSteps = SignatureStep::where('company_id', $companyId)->count();

        $completedSteps = SignatureStep::where('company_id', $companyId)
            ->where('completed', true)
            ->count();

        $signatureProgress = $totalSteps > 0
            ? round(($completedSteps / $totalSteps) * 100)
            : 0;

        return response()->json([
            'revenue' => $this->revenue($companyId),
            'funnel' => $this->funnel($companyId),
            'contracts' => $this->contracts($companyId),
            'efficiency' => [
                [
                    'name' => 'Documentos',
                    'accuracy' => $documentAccuracy,
                    'pending' => $pendingDocuments,
                    'errors' => $rejectedDocuments,
                ],
            ],
            'kpis' => [
                [
                    'title' => 'Acurácia Docs',
                    'value' => $documentAccuracy . '%',
                ],
                [
                    'title' => 'Assinaturas',
                    'value' => $signatureProgress . '%',
                ],
                [
                    'title' => 'Pendentes',
                    'value' => $pendingPercentage . '%',
                    'trend' => 'down',
                ],
                [
                    'title' => 'Contratos',
                    'value' => (string) $contractsTotal,
                ],
                [
                    'title' => 'Imóveis',
                    'value' => (string) Property::where('company_id', $companyId)->count(),
                ],
                [
                    'title' => 'Clientes',
                    'value' => (string) Client::where('company_id', $companyId)->count(),
                ],
            ],

            'documents_by_status' => $this->documentsByStatus($companyId),
            'contracts_by_month' => $this->contractsByMonth($companyId),
            'contracts_by_type' => $this->contractsByType($companyId),
            'top_properties' => $this->topProperties($companyId),
        ]);
    }

    private function revenue(int $companyId)
    {
        $months = [
            1 => 'Jan',
            2 => 'Fev',
            3 => 'Mar',
            4 => 'Abr',
            5 => 'Mai',
            6 => 'Jun',
            7 => 'Jul',
            8 => 'Ago',
            9 => 'Set',
            10 => 'Out',
            11 => 'Nov',
            12 => 'Dez',
        ];

        return collect(range(1, 12))->map(function ($month) use ($companyId, $months) {
            return [
                'name' => $months[$month],
                'vendas' => (float) Contract::where('company_id', $companyId)
                    ->whereMonth('created_at', $month)
                    ->where('type', 'Venda')
                    ->sum('value'),

                'locacao' => (float) Contract::where('company_id', $companyId)
                    ->whereMonth('created_at', $month)
                    ->where('type', 'Aluguel')
                    ->sum('value'),
            ];
        })->values();
    }

    private function funnel(int $companyId)
    {
        $statuses = [
            'Lead' => 'bg-indigo-500',
            'Ativo' => 'bg-cyan-400',
            'Em negociação' => 'bg-yellow-400',
            'Fechado' => 'bg-emerald-400',
        ];

        $total = Client::where('company_id', $companyId)->count();

        return collect($statuses)->map(function ($color, $status) use ($companyId, $total) {
            $value = Client::where('company_id', $companyId)
                ->where('status', $status)
                ->count();

            return [
                'label' => $status,
                'value' => $value,
                'percentage' => $total > 0 ? round(($value / $total) * 100) : 0,
                'color' => $color,
            ];
        })->values();
    }

    private function contracts(int $companyId)
    {
        return Contract::query()
            ->where('contracts.company_id', $companyId)
            ->leftJoin('clients', 'clients.id', '=', 'contracts.client_id')
            ->select(
                DB::raw("COALESCE(clients.name, 'Sem cliente') as name"),
                DB::raw('COUNT(contracts.id) as value')
            )
            ->groupBy('clients.name')
            ->orderByDesc('value')
            ->limit(6)
            ->get();
    }

    private function documentsByStatus(int $companyId)
    {
        $total = Document::where('company_id', $companyId)->count();

        $statuses = [
            'valid' => 'Válido',
            'pending' => 'Pendente',
            'expired' => 'Vencido',
        ];

        return collect($statuses)->map(function ($label, $status) use ($companyId, $total) {
            $value = Document::where('company_id', $companyId)
                ->where('status', $status)
                ->count();

            return [
                'name' => $label,
                'value' => $value,
                'percentage' => $total > 0 ? round(($value / $total) * 100) : 0,
            ];
        })->values();
    }

    private function contractsByMonth(int $companyId)
    {
        $months = [
            1 => 'Jan',
            2 => 'Fev',
            3 => 'Mar',
            4 => 'Abr',
            5 => 'Mai',
            6 => 'Jun',
            7 => 'Jul',
            8 => 'Ago',
            9 => 'Set',
            10 => 'Out',
            11 => 'Nov',
            12 => 'Dez',
        ];

        return collect(range(1, 12))->map(function ($month) use ($companyId, $months) {
            $value = Contract::where('company_id', $companyId)
                ->whereMonth('created_at', $month)
                ->count();

            return [
                'name' => $months[$month],
                'value' => $value,
            ];
        })->values();
    }

    private function contractsByType(int $companyId)
    {
        return Contract::query()
            ->where('company_id', $companyId)
            ->select('type as name', DB::raw('COUNT(*) as value'))
            ->groupBy('type')
            ->get();
    }

    private function topProperties(int $companyId)
    {
        return Contract::query()
            ->where('contracts.company_id', $companyId)
            ->leftJoin('properties', 'properties.id', '=', 'contracts.property_id')
            ->select(
                DB::raw("COALESCE(properties.title, 'Sem imóvel') as name"),
                DB::raw('COUNT(contracts.id) as value')
            )
            ->groupBy('properties.title')
            ->orderByDesc('value')
            ->limit(5)
            ->get();
    }
}
