import { PropertyFormModal } from "../../../components/imoveis/PropertyFormModal";
import type { PropertyItem } from "../../../types/property";
import type { PropertyFormData } from "../types/propertyForm";

export function PropertiesEmptyState({
  showFormModal,
  editingProperty,
  onCreate,
  onSave,
  onCloseForm,
}: {
  showFormModal: boolean;
  editingProperty: PropertyItem | null;
  onCreate: () => void;
  onSave: (data: PropertyFormData) => void;
  onCloseForm: () => void;
}) {
  return (
    <>
      <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
        Nenhum imóvel cadastrado.

        <button
          onClick={onCreate}
          className="mx-auto mt-4 flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
        >
          Adicionar Imóvel
        </button>
      </div>

      {showFormModal && (
        <PropertyFormModal
          editingProperty={editingProperty}
          onSave={onSave}
          onClose={onCloseForm}
        />
      )}
    </>
  );
}