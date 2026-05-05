import {
  Check,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
} from "lucide-react";
import type { ContractClause } from "../../types/contract";

type ApiContract = any;

export function ContractClauseList({
  contracts,
  selectedContractId,
  selectedClauseId,
  selectedType,
  filter,
  onSelectContract,
  onSelectClause,
  onToggleStatus,
  onToggleExpanded,
}: {
  contracts: ApiContract[];
  selectedContractId: number | null;
  selectedClauseId: number | null;
  selectedType: "contract" | "clause" | null;
  filter: "all" | "pending";
  onSelectContract: (contract: ApiContract) => void;
  onSelectClause: (contract: ApiContract, clause: ContractClause) => void;
  onToggleStatus: (id: number) => void;
  onToggleExpanded: (id: number) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl">
      <div className="grid grid-cols-[1fr_120px] rounded-lg bg-slate-700/40 px-4 py-3 text-sm text-slate-300">
        <span className="pl-8">Contratos / Cláusulas</span>
        <span>Status</span>
      </div>

      <div className="mt-2 max-h-[560px] space-y-2 overflow-auto pr-1 no-scrollbar">
        {contracts.map((contract) => {
          const clauses = (contract.clauses ?? []).filter((clause: any) =>
            filter === "pending" ? clause.status === "pending" : true
          );

          const isContractSelected =
            selectedType === "contract" && selectedContractId === contract.id;

          return (
            <div key={contract.id} className="space-y-1">
              <button
                type="button"
                onClick={() => onSelectContract(contract)}
                className={`grid w-full grid-cols-[1fr_120px] items-center rounded-lg px-3 py-3 text-left transition ${isContractSelected
                    ? "border border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,.25)]"
                    : "border border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <FileText size={17} className="shrink-0 text-cyan-300" />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-100">
                      {contract.title}
                    </p>

                    <p className="truncate text-xs text-slate-400">
                      {contract.client?.name ?? "Sem cliente"} ·{" "}
                      {contract.property?.title ?? "Sem imóvel"}
                    </p>
                  </div>
                </div>

                <span className="text-xs text-yellow-300">
                  {contract.status ?? "Pendente"}
                </span>
              </button>

              {clauses.map((clause: any) => {
                const isClauseSelected =
                  selectedType === "clause" && selectedClauseId === clause.id;

                return (
                  <div
                    key={clause.id}
                    className={`ml-5 rounded-lg px-3 py-3 transition ${isClauseSelected
                        ? "border border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,.25)]"
                        : "hover:bg-white/5"
                      }`}
                  >
                    <div className="grid grid-cols-[1fr_120px] items-center">
                      <button
                        type="button"
                        onClick={() =>
                          onSelectClause(contract, {
                            id: clause.id,
                            contractId: contract.id,
                            title: clause.title,
                            description: clause.description ?? "",
                            status:
                              clause.status === "approved"
                                ? "approved"
                                : "pending",
                            expanded: Boolean(clause.expanded),
                          })
                        }
                        className="flex min-w-0 items-center gap-3 text-left"
                      >
                        <ChevronRight
                          size={17}
                          className={`shrink-0 text-slate-400 transition ${clause.expanded ? "rotate-90" : ""
                            }`}
                        />

                        <span className="truncate text-sm font-medium text-slate-200">
                          {clause.title}
                        </span>
                      </button>

                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            onToggleStatus(clause.id);
                          }}
                          className={`flex h-8 w-8 items-center justify-center rounded-full transition ${clause.status === "approved"
                              ? "bg-emerald-500 text-white"
                              : "bg-yellow-400 text-slate-900"
                            }`}
                        >
                          {clause.status === "approved" ? (
                            <Check size={18} />
                          ) : (
                            <Clock3 size={16} />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleExpanded(clause.id)}
                          className="rounded-md p-1 text-slate-400 hover:bg-white/5 hover:text-white"
                        >
                          <ChevronDown size={18} />
                        </button>
                      </div>
                    </div>

                    {clause.expanded && (
                      <div className="ml-8 mt-3 rounded-lg border border-white/10 bg-[#0b1627] p-3 text-sm text-slate-400">
                        {clause.description ||
                          "Nenhuma descrição cadastrada para esta cláusula."}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}