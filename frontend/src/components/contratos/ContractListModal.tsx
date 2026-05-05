import { Edit3, Plus, Trash2, X } from "lucide-react";

export function ContractListModal({
  contracts,
  selectedContractId,
  onSelect,
  onAdd,
  onEdit,
  onDelete,
  onClose,
}: {
  contracts: any[];
  selectedContractId: number | null;
  onSelect: (contract: any) => void;
  onAdd: () => void;
  onEdit: (contract: any) => void;
  onDelete: (contract: any) => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-2xl border border-white/10 bg-[#101c2d] p-5 shadow-[0_20px_70px_rgba(0,0,0,.45)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold">Listagem de Contratos</h3>
            <p className="mt-1 text-sm text-slate-400">
              Gerencie, edite ou exclua contratos cadastrados.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onAdd}
              className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
            >
              <Plus size={17} />
              Adicionar Contrato
            </button>

            <button
              onClick={onClose}
              className="rounded-lg border border-white/10 p-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1.3fr_1fr_1fr_.8fr_.7fr_.5fr] border-b border-white/10 px-3 pb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <span>Contrato</span>
          <span>Cliente</span>
          <span>Imóvel</span>
          <span>Status</span>
          <span>Valor</span>
          <span>Ações</span>
        </div>

        <div className="max-h-[520px] space-y-2 overflow-auto pt-3 no-scrollbar">
          {contracts.map((contract) => (
            <div
              key={contract.id}
              onClick={() => onSelect(contract)}
              className={`grid cursor-pointer grid-cols-[1.3fr_1fr_1fr_.8fr_.7fr_.5fr] items-center rounded-lg px-3 py-3 text-sm transition ${
                selectedContractId === contract.id
                  ? "border border-cyan-400 bg-cyan-400/10"
                  : "hover:bg-white/5"
              }`}
            >
              <div>
                <p className="truncate font-medium text-slate-100">
                  {contract.title}
                </p>
                <p className="text-xs text-slate-400">
                  {contract.type ?? "Contrato"}
                </p>
              </div>

              <span className="truncate text-slate-300">
                {contract.client?.name ?? "Sem cliente"}
              </span>

              <span className="truncate text-slate-300">
                {contract.property?.title ?? "Sem imóvel"}
              </span>

              <span className="text-xs text-yellow-400">
                {contract.status ?? "Pendente"}
              </span>

              <span className="text-slate-300">
                {Number(contract.value ?? 0).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </span>

              <div className="flex gap-2">
                <Edit3
                  size={16}
                  className="cursor-pointer text-slate-400 transition hover:text-cyan-400"
                  onClick={(event) => {
                    event.stopPropagation();
                    onEdit(contract);
                  }}
                />

                <Trash2
                  size={16}
                  className="cursor-pointer text-slate-400 transition hover:text-red-400"
                  onClick={(event) => {
                    event.stopPropagation();
                    onDelete(contract);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}