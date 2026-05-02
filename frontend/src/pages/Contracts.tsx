import { useMemo, useState } from "react";
import { ContractClauseList } from "../components/contratos/ContractClauseList";
import { ContractDetailsCard } from "../components/contratos/ContractDetailsCard";
import { ContractDocumentsPanel } from "../components/contratos/ContractDocumentsPanel";
import { SignatureTimelinePanel } from "../components/contratos/SignatureTimelinePanel";
import {
  contractDetailsByClauseId,
  contractDocumentsByClauseId,
  initialClauses,
  signatureEventsByClauseId,
  signatureStepsByClauseId,
} from "../components/data/contracts";
import type { ContractClause, SignatureStep } from "../types/contract";

export function Contracts() {
  const [clauses, setClauses] = useState<ContractClause[]>(initialClauses);
  const [selectedClauseId, setSelectedClauseId] = useState<number | null>(null);
  const [steps, setSteps] = useState<SignatureStep[]>([]);
  const [filter, setFilter] = useState<"all" | "pending">("all");

  const selectedClause = useMemo(() => {
    if (!selectedClauseId) return null;
    return clauses.find((clause) => clause.id === selectedClauseId) ?? null;
  }, [clauses, selectedClauseId]);

  const selectedDetails = selectedClauseId
    ? contractDetailsByClauseId[selectedClauseId]
    : null;

  const selectedEvents = selectedClauseId
    ? signatureEventsByClauseId[selectedClauseId] ?? []
    : [];

  const selectedDocuments = selectedClauseId
    ? contractDocumentsByClauseId[selectedClauseId] ?? []
    : [];

  function handleSelectClause(clause: ContractClause) {
    setSelectedClauseId(clause.id);
    setSteps(signatureStepsByClauseId[clause.id] ?? []);
  }

  function toggleClauseStatus(id: number) {
    setClauses((current) =>
      current.map((clause) =>
        clause.id === id
          ? {
              ...clause,
              status: clause.status === "approved" ? "pending" : "approved",
            }
          : clause
      )
    );
  }

  function toggleClauseExpanded(id: number) {
    setClauses((current) =>
      current.map((clause) =>
        clause.id === id ? { ...clause, expanded: !clause.expanded } : clause
      )
    );
  }

  function toggleStep(id: number) {
    setSteps((current) =>
      current.map((step) =>
        step.id === id ? { ...step, completed: !step.completed } : step
      )
    );
  }

  function openDetails() {
    alert(
      selectedClause
        ? `Detalhes da cláusula: ${selectedClause.title}`
        : "Selecione uma cláusula."
    );
  }

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-5">
      <section className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-5 shadow-[0_18px_45px_rgba(0,0,0,.25)]">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold">
            {selectedClause ? selectedClause.title : "Contratos"}
          </h2>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                filter === "all"
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                  : "border border-white/10 text-slate-400 hover:bg-white/5"
              }`}
            >
              Todos
            </button>

            <button
              onClick={() => setFilter("pending")}
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

        <div
          className={`grid gap-5 ${
            selectedClause && selectedDetails
              ? "grid-cols-[minmax(0,1fr)_290px]"
              : "grid-cols-1"
          }`}
        >
          <ContractClauseList
            clauses={clauses}
            selectedId={selectedClauseId}
            filter={filter}
            onSelect={handleSelectClause}
            onToggleStatus={toggleClauseStatus}
            onToggleExpanded={toggleClauseExpanded}
          />

          {selectedClause && selectedDetails && (
            <ContractDetailsCard
              details={selectedDetails}
              selectedClause={selectedClause}
              onOpenDetails={openDetails}
            />
          )}
        </div>
      </section>

      <aside className="space-y-5">
        {selectedClause ? (
          <>
            <SignatureTimelinePanel
              steps={steps}
              events={selectedEvents}
              onToggleStep={toggleStep}
            />

            <ContractDocumentsPanel documents={selectedDocuments} />
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