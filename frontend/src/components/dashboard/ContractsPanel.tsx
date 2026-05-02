import { FileText } from "lucide-react";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";

const contracts = [
  "Contrato Rinal",
  "Contrato Próximos ao Vei",
  "Contrato Próximos ao Vencimento",
  "Contrato Próximos ao Vei",
  "Contrato Próximos ao Vencimento",
];

export function ContractsPanel() {
  return (
    <Card>
      <SectionHeader title="Contratos Próximos ao Vencimento" />

      <div className="space-y-4">
        {contracts.map((item, index) => (
          <div key={index} className="flex items-center gap-3">
            <FileText size={18} className="text-red-400" />
            <span className="flex-1 text-sm text-slate-300">{item}</span>

            <div className="h-2 w-24 rounded-full bg-slate-700">
              <div
                className="h-2 rounded-full bg-red-400"
                style={{ width: `${90 - index * 8}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}