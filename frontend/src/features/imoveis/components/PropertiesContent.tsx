import { useState } from "react";
import { ConfirmDeleteModal } from "../../../components/ui/ConfirmDeleteModal";
import { PropertyFormModal } from "../../../components/imoveis/PropertyFormModal";
import { PropertyGallery } from "../../../components/imoveis/PropertyGallery";
import { PropertyListModal } from "../../../components/imoveis/PropertyListModal";
import { PropertyMap } from "../../../components/imoveis/PropertyMap";
import { PropertyNegotiation } from "../../../components/imoveis/PropertyNegotiation";
import { PropertyNegotiationModal } from "./PropertyNegotiationModal";
import { PropertyVisits } from "./PropertyVisits";
import { PropertyVisitModal } from "./PropertyVisitModal";

import type {
  NegotiationItem,
  PropertyItem,
  VisitItem,
} from "../../../types/property";

import type { PropertyFormData } from "../types/propertyForm";

import type {
  ClientOption,
  NegotiationPayload,
  VisitPayload,
} from "../services/propertyRelations";

export function PropertiesContent({
  properties,
  selectedProperty,
  selectedPropertyId,
  showListModal,
  showFormModal,
  editingProperty,
  propertyToDelete,
  deleting,
  clients,
  onOpenList,
  onCloseList,
  onSelectProperty,
  onAddProperty,
  onEditProperty,
  onDeleteProperty,
  onCloseForm,
  onSaveProperty,
  onCloseDelete,
  onConfirmDelete,
  onSaveNegotiation,
  onDeleteNegotiation,
  onSaveVisit,
  onDeleteVisit,
}: {
  properties: PropertyItem[];
  selectedProperty: PropertyItem;
  selectedPropertyId: number | null;
  showListModal: boolean;
  showFormModal: boolean;
  editingProperty: PropertyItem | null;
  propertyToDelete: PropertyItem | null;
  deleting: boolean;
  clients: ClientOption[];
  onOpenList: () => void;
  onCloseList: () => void;
  onSelectProperty: (id: number | null) => void;
  onAddProperty: () => void;
  onEditProperty: (property: PropertyItem) => void;
  onDeleteProperty: (property: PropertyItem) => void;
  onCloseForm: () => void;
  onSaveProperty: (data: PropertyFormData) => void;
  onCloseDelete: () => void;
  onConfirmDelete: () => void;
  onSaveNegotiation: (
    propertyId: number,
    negotiationId: number | null,
    data: NegotiationPayload
  ) => Promise<void>;
  onDeleteNegotiation: (negotiationId: number) => Promise<void>;
  onSaveVisit: (
    propertyId: number,
    visitId: number | null,
    data: VisitPayload
  ) => Promise<void>;
  onDeleteVisit: (visitId: number) => Promise<void>;
}) {
  const visits = selectedProperty.visits ?? [];

  const [showNegotiationModal, setShowNegotiationModal] = useState(false);

  const [editingNegotiation, setEditingNegotiation] =
    useState<NegotiationItem | null>(null);

  const [showVisitModal, setShowVisitModal] = useState(false);
  const [editingVisit, setEditingVisit] = useState<VisitItem | null>(null);

  function openCreateVisit() {
    setEditingVisit(null);
    setShowVisitModal(true);
  }

  function openEditVisit(item: VisitItem) {
    setEditingVisit(item);
    setShowVisitModal(true);
  }

  function closeVisitModal() {
    setEditingVisit(null);
    setShowVisitModal(false);
  }

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-5">
        <section className="space-y-5">
          <PropertyGallery
            property={selectedProperty}
            onOpenList={onOpenList}
          />

          <PropertyNegotiation
            negotiations={selectedProperty.negotiations}
            onCreate={() => {
              setEditingNegotiation(null);
              setShowNegotiationModal(true);
            }}
            onEdit={(item) => {
              setEditingNegotiation(item);
              setShowNegotiationModal(true);
            }}
            onDelete={(item) => onDeleteNegotiation(item.id)}
          />
        </section>

        <aside className="space-y-5">
          <PropertyMap
            properties={properties}
            selectedPropertyId={selectedProperty.id}
            onSelectProperty={onSelectProperty}
          />

          <PropertyVisits
            visits={visits}
            onCreate={openCreateVisit}
            onEdit={openEditVisit}
            onDelete={(item) => onDeleteVisit(item.id)}
          />
        </aside>
      </div>

      {showListModal && (
        <PropertyListModal
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          onClose={onCloseList}
          onAdd={onAddProperty}
          onSelect={(property) => {
            onSelectProperty(property.id);
            onCloseList();
          }}
          onEdit={onEditProperty}
          onDelete={onDeleteProperty}
        />
      )}

      {showFormModal && (
        <PropertyFormModal
          editingProperty={editingProperty}
          onSave={onSaveProperty}
          onClose={onCloseForm}
        />
      )}

      <PropertyNegotiationModal
        open={showNegotiationModal}
        clients={clients}
        editingItem={editingNegotiation}
        onClose={() => {
          setShowNegotiationModal(false);
          setEditingNegotiation(null);
        }}
        onSubmit={async (data) => {
          await onSaveNegotiation(
            selectedProperty.id,
            editingNegotiation?.id ?? null,
            data
          );

          setShowNegotiationModal(false);
          setEditingNegotiation(null);
        }}
      />

      <PropertyVisitModal
        open={showVisitModal}
        clients={clients}
        editingItem={editingVisit}
        onClose={closeVisitModal}
        onSubmit={async (data) => {
          await onSaveVisit(
            selectedProperty.id,
            editingVisit?.id ?? null,
            data
          );

          closeVisitModal();
        }}
      />

      <ConfirmDeleteModal
        open={!!propertyToDelete}
        itemName={propertyToDelete?.title}
        title="Excluir imóvel"
        description="Tem certeza que deseja excluir este imóvel? Essa ação não poderá ser desfeita."
        loading={deleting}
        onClose={onCloseDelete}
        onConfirm={onConfirmDelete}
      />
    </>
  );
}