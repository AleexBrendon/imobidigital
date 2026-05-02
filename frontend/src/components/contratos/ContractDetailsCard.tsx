import { MoreVertical } from "lucide-react";
import type { ContractClause, ContractDetails } from "../../types/contract";

export function ContractDetailsCard({
  details,
  selectedClause,
  onOpenDetails,
}: {
  details: ContractDetails;
  selectedClause: ContractClause;
  onOpenDetails: () => void;
}) {
  return (
    <div className="rounded-2xl border border-cyan-400/70 bg-[#132236] p-5 shadow-[0_0_28px_rgba(34,211,238,.38)]">
      <div className="mb-5 flex items-start justify-between">
        <h3 className="text-2xl font-semibold">{details.title}</h3>
        <MoreVertical size={22} className="text-slate-400" />
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-b border-white/10 pb-4">
        <Info label="Data de" value={details.startDate} />
        <Info label="Data" value={details.endDate} />
        <Info label="Data" value={details.startDate} />
        <Info label="Valuor" value={details.value} />
        <Info label="Propiesta de its..." value={details.fee} />
        <Info label="Valurs de IA" value={details.aiValue} />
      </div>

      <div className="space-y-4 border-b border-white/10 py-4">
        <Info label="Propriedade" value={details.property} />
        <Info label="Propriedade todo:" value={details.code} />
        <Info label="Propriedade" value={details.category} />
      </div>

      <div className="mt-4 rounded-xl border border-white/10 bg-[#0b1627] p-3 text-sm text-slate-300">
        <span className="text-slate-500">Selecionado:</span>{" "}
        {selectedClause.title}
      </div>

      <button
        type="button"
        onClick={onOpenDetails}
        className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-white"
      >
        Detalhes
      </button>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-medium text-slate-100">{value}</p>
    </div>
  );
}