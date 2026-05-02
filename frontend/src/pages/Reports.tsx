import { RevenueChart } from "../components/relatorios/RevenueChart";
import { ContractsChart } from "../components/relatorios/ContractsChart";
import { FunnelChart } from "../components/relatorios/FunnelChart";
import { KpiPanel } from "../components/relatorios/KpiPanel";
import { EfficiencyPanel } from "../components/relatorios/EfficiencyPanel";
import { Card } from "../components/ui/Card";

export function Reports() {
  return (
    <div className="grid grid-cols-[1fr_340px] gap-5">
      {/* LEFT */}
      <section className="space-y-5">
        <Card title="Desempenho de Vendas e Locação" glow>
          <RevenueChart />
        </Card>

        <div className="grid grid-cols-2 gap-5">
          <Card title="Funil de Prospecção">
            <FunnelChart />
          </Card>

          <Card title="Contratos Assinados">
            <ContractsChart />
          </Card>
        </div>
      </section>

      {/* RIGHT */}
      <aside className="space-y-5">
        <EfficiencyPanel />
        <KpiPanel />
      </aside>
    </div>
  );
}