import { KPI } from "../ui/KPI";
import type { ReportKpi } from "../../types/reports";

export function KpiPanel({
  kpis = [],
}: {
  kpis?: ReportKpi[];
}) {
  if (!Array.isArray(kpis)) return null;

  return (
    <div className="space-y-4">
      {kpis.map((kpi) => (
        <KPI
          key={kpi.title}
          title={kpi.title}
          value={kpi.value}
          trend={kpi.trend}
          compact
        />
      ))}
    </div>
  );
}