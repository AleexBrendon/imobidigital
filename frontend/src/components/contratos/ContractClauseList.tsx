import { Check, ChevronDown, ChevronRight, Clock3 } from "lucide-react";
import type { ContractClause } from "../../types/contract";

export function ContractClauseList({
  clauses,
  selectedId,
  filter,
  onSelect,
  onToggleStatus,
  onToggleExpanded,
}: {
  clauses: ContractClause[];
  selectedId: number | null;
  filter: "all" | "pending";
  onSelect: (clause: ContractClause) => void;
  onToggleStatus: (id: number) => void;
  onToggleExpanded: (id: number) => void;
}) {
  const visibleClauses =
    filter === "pending"
      ? clauses.filter((clause) => clause.status === "pending")
      : clauses;

  return (
    <div className="overflow-hidden rounded-xl">
      <div className="grid grid-cols-[1fr_120px] rounded-lg bg-slate-700/40 px-4 py-3 text-sm text-slate-300">
        <span className="pl-8">Cláuses</span>
        <span>Status</span>
      </div>

      <div className="mt-2 max-h-[560px] space-y-1 overflow-auto pr-1 no-scrollbar">
        {visibleClauses.map((clause) => (
          <div
            key={clause.id}
            className={`rounded-lg border px-3 py-2.5 transition ${
              selectedId === clause.id
                ? "border-cyan-400/70 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,.35)]"
                : "border-transparent hover:bg-white/5"
            }`}
          >
            <div className="grid grid-cols-[1fr_120px] items-center gap-3">
              <button
                type="button"
                onClick={() => onSelect(clause)}
                className="flex min-w-0 items-center gap-3 text-left"
              >
                <ChevronRight
                  size={18}
                  className={`shrink-0 text-slate-400 transition ${
                    clause.expanded ? "rotate-90" : ""
                  }`}
                />

                <span className="truncate text-sm font-medium text-slate-200">
                  {clause.title}
                </span>
              </button>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onToggleStatus(clause.id)}
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                    clause.status === "approved"
                      ? "bg-emerald-500 text-white"
                      : "bg-yellow-400 text-slate-900"
                  }`}
                  title="Alterar status"
                >
                  {clause.status === "approved" ? (
                    <Check size={18} />
                  ) : (
                    <Clock3 size={17} />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => onToggleExpanded(clause.id)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
                  title="Expandir cláusula"
                >
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            {clause.expanded && (
              <div className="ml-8 mt-3 rounded-lg border border-white/10 bg-[#0b1627] p-3 text-sm text-slate-400">
                Esta cláusula contém regras de locação, validação documental e
                condições da visita. Clique no status para alternar entre
                aprovado e pendente.
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}