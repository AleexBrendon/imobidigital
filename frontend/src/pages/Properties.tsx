import { PropertiesContent } from "../features/imoveis/components/PropertiesContent";
import { PropertiesEmptyState } from "../features/imoveis/components/PropertiesEmptyState";
import { useProperties } from "../features/imoveis/hooks/useProperties";

export function Properties() {
  const {
    properties,
    selectedProperty,
    selectedPropertyId,
    loading,
    deleting,

    showListModal,
    showFormModal,
    editingProperty,
    propertyToDelete,

    setSelectedPropertyId,
    setShowListModal,
    setPropertyToDelete,

    saveProperty,
    confirmDeleteProperty,
    openCreateModal,
    openEditModal,
    closeFormModal,

    clients,
    saveNegotiation,
    removeNegotiation,
    saveVisit,
    removeVisit,
  } = useProperties();

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
        Carregando imóveis...
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <PropertiesEmptyState
        showFormModal={showFormModal}
        editingProperty={editingProperty}
        onCreate={openCreateModal}
        onSave={saveProperty}
        onCloseForm={closeFormModal}
      />
    );
  }

  return (
    <PropertiesContent
      properties={properties}
      selectedProperty={selectedProperty}
      selectedPropertyId={selectedPropertyId}
      showListModal={showListModal}
      showFormModal={showFormModal}
      editingProperty={editingProperty}
      propertyToDelete={propertyToDelete}
      deleting={deleting}
      onOpenList={() => setShowListModal(true)}
      onCloseList={() => setShowListModal(false)}
      onSelectProperty={setSelectedPropertyId}
      onAddProperty={openCreateModal}
      onEditProperty={openEditModal}
      onDeleteProperty={setPropertyToDelete}
      onCloseForm={closeFormModal}
      onSaveProperty={saveProperty}
      onCloseDelete={() => setPropertyToDelete(null)}
      onConfirmDelete={confirmDeleteProperty}
      clients={clients}
      onSaveNegotiation={saveNegotiation}
      onDeleteNegotiation={removeNegotiation}
      onSaveVisit={saveVisit}
      onDeleteVisit={removeVisit}
    />
  );
}