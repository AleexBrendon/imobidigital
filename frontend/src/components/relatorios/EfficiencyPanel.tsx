import { Metric } from "../ui/Metric";
import { Card } from "../ui/Card";

import type { EfficiencyAgent } from "../../types/reports";

export function EfficiencyPanel({
  agents = [],
}: {
  agents?: EfficiencyAgent[];
}) {
  return (
    <Card title="Eficiência da Validação de Documentos">
      <div className="space-y-3">
        {agents.map((agent) => (
          <Metric
            key={agent.name}
            name={agent.name}
            value={`${agent.accuracy}%`}
            color={agent.accuracy >= 80 ? "cyan" : "green"}
          />
        ))}
      </div>

      <div className="mt-4 border-t border-white/10 pt-4 text-sm">
        <div className="mb-2 grid grid-cols-4 text-slate-400">
          <span>Agente</span>
          <span>Acurácia</span>
          <span>Pendentes</span>
          <span>Erros</span>
        </div>

        {agents.map((agent) => (
          <div key={agent.name} className="grid grid-cols-4 gap-3 text-center text-slate-200">
            <span>{agent.name}</span>
            <span className="text-cyan-400">{agent.accuracy}%</span>
            <span>{agent.pending}</span>
            <span className="text-red-400">{agent.errors}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}