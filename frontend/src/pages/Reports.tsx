import { useEffect, useState } from "react";

import { RevenueChart } from "../components/relatorios/RevenueChart";
import { ContractsChart } from "../components/relatorios/ContractsChart";
import { FunnelChart } from "../components/relatorios/FunnelChart";
import { KpiPanel } from "../components/relatorios/KpiPanel";
//import { EfficiencyPanel } from "../components/relatorios/EfficiencyPanel";
import { DocumentsStatusChart } from "../components/relatorios/DocumentsStatusChart";
import { ContractsByMonthChart } from "../components/relatorios/ContractsByMonthChart";
import { ContractsTypeChart } from "../components/relatorios/ContractsTypeChart";
import { TopPropertiesChart } from "../components/relatorios/TopPropertiesChart";
import { Card } from "../components/ui/Card";

import { getReports } from "../services/reports";
import type { ReportsResponse } from "../types/reports";

export function Reports() {
  const [reports, setReports] = useState<ReportsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadReports() {
    try {
      setLoading(true);

      const data = await getReports();

      setReports(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports();
  }, []);

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
        Carregando relatórios...
      </div>
    );
  }

  if (!reports) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
        Nenhum relatório encontrado.
      </div>
    );
  }

  return (
    <main className="mx-auto grid w-full max-w-[1540px] grid-cols-[minmax(0,1fr)_360px] gap-5 px-4 py-4">
      <section className="min-w-0 space-y-5">
        <Card title="Desempenho de Vendas e Locação" glow className="h-[380px]">
          <RevenueChart data={reports.revenue ?? []} />
        </Card>

        <div className="grid min-w-0 grid-cols-2 gap-5">
          <Card title="Funil de Prospecção" className="h-[325px]">
            <FunnelChart data={reports.funnel ?? []} />
          </Card>

          <Card title="Contratos Assinados" className="h-[325px]">
            <ContractsChart data={reports.contracts ?? []} />
          </Card>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-5">
          <Card title="Documentos por Status" className="h-[325px]">
            <DocumentsStatusChart data={reports.documents_by_status ?? []} />
          </Card>

          <Card title="Novos Contratos (Últimos 6 Meses)" className="h-[325px]">
            <ContractsByMonthChart data={reports.contracts_by_month ?? []} />
          </Card>
        </div>

        <div className="grid min-w-0 grid-cols-2 gap-5">
          <Card title="Contratos por Tipo" className="h-[325px]">
            <ContractsTypeChart data={reports.contracts_by_type ?? []} />
          </Card>

          <Card title="Top 5 Imóveis mais Contratados" className="h-[325px]">
            <TopPropertiesChart data={reports.top_properties ?? []} />
          </Card>
        </div>
      </section>

      <aside className="space-y-5 self-start">
        <KpiPanel kpis={Array.isArray(reports.kpis) ? reports.kpis : []} />
      </aside>
    </main>
  );
}
