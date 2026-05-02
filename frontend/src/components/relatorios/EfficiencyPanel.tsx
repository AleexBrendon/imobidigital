import { Metric } from "../ui/Metric";
import { Card } from "../ui/Card";

export function EfficiencyPanel() {
  return (
    <Card title="Eficiência da Validação de Documentos">
      <div className="space-y-3">
        <Metric name="Maria Lima" value="55%" color="green" />
        <Metric name="João Silva" value="96%" color="cyan" />
      </div>

      {/* tabela resumida */}
      <div className="mt-4 border-t border-white/10 pt-4 text-sm">
        <div className="mb-2 grid grid-cols-4 text-slate-400">
          <span>Agente</span>
          <span>Acurácia</span>
          <span>Pendentes</span>
          <span>Erros</span>
        </div>

        <div className="grid grid-cols-4 text-slate-200">
          <span>Maria</span>
          <span className="text-green-400">55%</span>
          <span>100%</span>
          <span className="text-red-400">0</span>
        </div>

        <div className="grid grid-cols-4 text-slate-200">
          <span>João</span>
          <span className="text-cyan-400">96%</span>
          <span>1%</span>
          <span className="text-red-400">0</span>
        </div>
      </div>
    </Card>
  );
}