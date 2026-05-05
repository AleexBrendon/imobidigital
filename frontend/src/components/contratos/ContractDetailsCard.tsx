import { MoreVertical } from "lucide-react";
import type { ContractClause, ContractDetails } from "../../types/contract";

export function ContractDetailsCard({
  details,
  selectedClause,
}: {
  details: ContractDetails;
  selectedClause: ContractClause;
}) {
  return (
    <div className="rounded-2xl border border-cyan-400/70 bg-[#132236] p-5 shadow-[0_0_28px_rgba(34,211,238,.35)]">
      <div className="mb-5 flex items-start justify-between">
        <h3 className="text-xl font-semibold">{details.title}</h3>
        <MoreVertical size={20} className="text-slate-400" />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-white/10 pb-4">
        <Info label="Data de" value={details.startDate} />
        <Info label="Data" value={details.endDate} />
        <Info label="Valor" value={details.value} />
        <Info label="Taxa" value={details.fee} />
        <Info label="IA" value={details.aiValue} />
      </div>

      <div className="space-y-3 border-b border-white/10 py-4">
        <Info label="Propriedade" value={details.property} />
        <Info label="Código" value={details.code} />
        <Info label="Categoria" value={details.category} />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-[#0b1627] p-3">
        <p className="text-xs text-slate-500">Cláusula selecionada</p>

        <p className="mt-1 font-semibold text-slate-100">
          {selectedClause.title}
        </p>

        <p className="mt-2 text-sm text-slate-400">
          {selectedClause.description ||
            "Nenhuma descrição cadastrada para esta cláusula."}
        </p>

        <span
          className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            selectedClause.status === "approved"
              ? "bg-emerald-500/20 text-emerald-300"
              : "bg-yellow-400/20 text-yellow-300"
          }`}
        >
          {selectedClause.status === "approved"
            ? "Aprovada"
            : "Pendente"}
        </span>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
    </div>
  );
}