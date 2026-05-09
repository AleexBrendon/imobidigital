import { FileText } from "lucide-react";
import { Card } from "./Card";
import { SectionHeader } from "./SectionHeader";

type ContractItem = {
  id: number;
  title: string;
  progress: number;
  status: string;
  end_date: string;
};

export function ContractsPanel({
  contracts,
}: {
  contracts: ContractItem[];
}) {
  return (
    <Card>
      <SectionHeader title="Contratos Próximos ao Vencimento" />

      <div className="space-y-4">
        {contracts.map((contract) => (
          <div
            key={contract.id}
            className="flex items-center gap-3"
          >
            <FileText size={18} className="text-red-400" />

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-slate-300">
                {contract.title}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                Vence em{" "}
                {new Date(contract.end_date).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>

            <div className="h-2 w-24 rounded-full bg-slate-700">
              <div
                className="h-2 rounded-full bg-red-400"
                style={{
                  width: `${contract.progress}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}