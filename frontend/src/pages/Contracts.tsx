import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { matchesSearch } from "../utils/search";

import { ContractFormModal } from "../components/contratos/ContractFormModal";
import { ContractListModal } from "../components/contratos/ContractListModal";
import { ConfirmDeleteModal } from "../components/ui/ConfirmDeleteModal";
import { ContractMainPanel } from "../features/contratos/components/ContractMainPanel";
import { useContractsPage } from "../features/contratos/hooks/useContractsPage";

export function Contracts() {
  const page = useContractsPage();
  const [searchParams] = useSearchParams();

  const search = searchParams.get("q") ?? "";

  const filteredContracts = useMemo(() => {
    return page.contracts.filter((contract) =>
      matchesSearch(contract, search)
    );
  }, [page.contracts, search]);

  if (page.loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
        Carregando contratos...
      </div>
    );
  }

  if (page.contracts.length === 0) {
    return (
      <>
        <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
          Nenhum contrato cadastrado.

          <button
            onClick={() => {
              page.setEditingContract(null);
              page.setShowFormModal(true);
            }}
            className="mx-auto mt-4 flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          >
            Adicionar Contrato
          </button>
        </div>

        {page.showFormModal && (
          <ContractFormModal
            editingContract={page.editingContract}
            clients={page.clients}
            properties={page.properties}
            onSave={page.saveContract}
            onClose={() => {
              page.setEditingContract(null);
              page.setShowFormModal(false);
            }}
          />
        )}
      </>
    );
  }

  if (filteredContracts.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
        Nenhum contrato encontrado para essa busca.
      </div>
    );
  }

  return (
    <>
      <ContractMainPanel
        contracts={filteredContracts}
        selectedContractId={page.selectedContractId}
        selectedClauseId={page.selectedClauseId}
        selectedType={page.selectedType}
        selectedClause={page.selectedClause}
        selectedDetails={page.selectedDetails}
        filter={page.filter}
        steps={page.steps}
        events={page.events}
        documents={page.documents}
        onClearDetails={page.clearDetails}
        onSetFilter={page.setFilter}
        onOpenList={() => page.setShowListModal(true)}
        onSelectContract={page.selectContractView}
        onSelectClause={page.selectClause}
        onToggleClauseStatus={page.toggleClauseStatus}
        onToggleClauseExpanded={page.toggleClauseExpanded}
        onToggleStep={page.toggleStep}
      />

      {page.showListModal && (
        <ContractListModal
          contracts={filteredContracts}
          selectedContractId={page.selectedContractId}
          onClose={() => page.setShowListModal(false)}
          onAdd={() => {
            page.setEditingContract(null);
            page.setShowFormModal(true);
          }}
          onSelect={(contract) => {
            page.selectContractView(contract);
            page.setShowListModal(false);
          }}
          onEdit={(contract) => {
            page.setEditingContract(contract);
            page.setShowFormModal(true);
          }}
          onDelete={(contract) => page.setContractToDelete(contract)}
        />
      )}

      {page.showFormModal && (
        <ContractFormModal
          editingContract={page.editingContract}
          clients={page.clients}
          properties={page.properties}
          onSave={page.saveContract}
          onClose={() => {
            page.setEditingContract(null);
            page.setShowFormModal(false);
          }}
        />
      )}

      <ConfirmDeleteModal
        open={!!page.contractToDelete}
        itemName={page.contractToDelete?.title}
        title="Excluir contrato"
        description="Tem certeza que deseja excluir este contrato? Essa ação não poderá ser desfeita."
        loading={page.deleting}
        onClose={() => page.setContractToDelete(null)}
        onConfirm={page.confirmDelete}
      />
    </>
  );
}