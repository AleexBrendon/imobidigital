import { ContractClauseList } from "../../../components/contratos/ContractClauseList";
import { ContractDetailsCard } from "../../../components/contratos/ContractDetailsCard";
import { ContractDocumentsPanel } from "../../../components/contratos/ContractDocumentsPanel";
import { SignatureTimelinePanel } from "../../../components/contratos/SignatureTimelinePanel";
import type { ContractClause } from "../../../types/contract";

export function ContractMainPanel({
  contracts,
  selectedContractId,
  selectedClauseId,
  selectedType,
  selectedClause,
  selectedDetails,
  filter,
  steps,
  events,
  documents,
  onClearDetails,
  onSetFilter,
  onOpenList,
  onSelectContract,
  onSelectClause,
  onToggleClauseStatus,
  onToggleClauseExpanded,
  onToggleStep,
}: any) {
  const fallbackClause: ContractClause = {
    id: 0,
    title: "Contrato selecionado",
    description: "Detalhes gerais do contrato.",
    status: "pending",
    expanded: false,
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-5">
      <section
        onClick={onClearDetails}
        className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Contratos</h2>

            <div
              onClick={(event) => event.stopPropagation()}
              className="mt-4 flex gap-2"
            >
              <button
                onClick={() => onSetFilter("all")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filter === "all"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "border border-white/10 text-slate-400 hover:bg-white/5"
                }`}
              >
                Todos
              </button>

              <button
                onClick={() => onSetFilter("pending")}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  filter === "pending"
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                    : "border border-white/10 text-slate-400 hover:bg-white/5"
                }`}
              >
                Pendentes
              </button>
            </div>
          </div>

          <button
            onClick={(event) => {
              event.stopPropagation();
              onOpenList();
            }}
            className="rounded-lg border border-white/10 px-3 py-2 text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            Gerenciar
          </button>
        </div>

        <div
          className={`grid gap-5 ${
            selectedType && selectedDetails
              ? "grid-cols-[minmax(0,1fr)_290px]"
              : "grid-cols-1"
          }`}
        >
          <div onClick={(event) => event.stopPropagation()}>
            <ContractClauseList
              contracts={contracts}
              selectedContractId={selectedContractId}
              selectedClauseId={selectedClauseId}
              selectedType={selectedType}
              filter={filter}
              onSelectContract={onSelectContract}
              onSelectClause={onSelectClause}
              onToggleStatus={onToggleClauseStatus}
              onToggleExpanded={onToggleClauseExpanded}
            />
          </div>

          {selectedType && selectedDetails && (
            <div onClick={(event) => event.stopPropagation()}>
              <ContractDetailsCard
                details={selectedDetails}
                selectedClause={selectedClause ?? fallbackClause}
              />
            </div>
          )}
        </div>
      </section>

      <aside className="space-y-5">
        {selectedContractId ? (
          <>
            <SignatureTimelinePanel
              steps={steps}
              events={events}
              onToggleStep={onToggleStep}
            />

            <ContractDocumentsPanel documents={documents} />
          </>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
            Selecione um contrato para visualizar assinatura e documentos.
          </div>
        )}
      </aside>
    </div>
  );
}