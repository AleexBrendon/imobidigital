import { KPI } from "../ui/KPI";

export function KpiPanel() {
  return (
    <div className="space-y-4">
      <KPI title="Acurácia IA" value="91%" />
      <KPI title="Acurácia Geral" value="82%" />
      <KPI title="Pendentes" value="10%" trend="down" />
      <KPI title="Tempo" value="2h 40s" trend="down" />
    </div>
  );
}