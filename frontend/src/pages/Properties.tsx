import { useEffect, useState } from "react";

import { PropertyGallery } from "../components/imoveis/PropertyGallery";
import { PropertyMap } from "../components/imoveis/PropertyMap";
import { PropertyNegotiation } from "../components/imoveis/PropertyNegotiation";
import { PropertyVisits } from "../components/imoveis/PropertyVisits";
import { PropertyListModal } from "../components/imoveis/PropertyListModal";
import { PropertyFormModal } from "../components/imoveis/PropertyFormModal";
import { ConfirmDeleteModal } from "../components/ui/ConfirmDeleteModal";
import { currencyBRToNumber, onlyNumbers } from "../utils/format";

import type {
  NegotiationItem,
  PropertyItem,
  VisitItem,
} from "../types/property";

import {
  createProperty,
  deleteProperty,
  getProperties,
  updateProperty,
  type PropertyPayload,
} from "../services/properties";

const defaultImages = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900",
];

function normalizeProperty(property: any): PropertyItem {
  return {
    id: property.id,
    title: property.title ?? "Imóvel sem título",
    address: property.address ?? "",
    city: property.city ?? "",
    state: property.state ?? "",
    price: property.price ?? "R$ 0,00",
    area: property.area ?? "0 m²",
    bedrooms: Number(property.bedrooms ?? 0),
    parkingSpaces: Number(
      property.parkingSpaces ?? property.parking_spaces ?? 0
    ),
    type: property.type ?? "Apartamento",
    status: property.status ?? "Disponível",
    images: property.images?.length ? property.images : defaultImages,
    ownerName: property.ownerName ?? property.owner_name ?? "",
  };
}

const negotiations: NegotiationItem[] = [];
const visits: VisitItem[] = [];

export function Properties() {
  const [properties, setProperties] = useState<PropertyItem[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );

  const [loading, setLoading] = useState(true);

  const [showListModal, setShowListModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);

  const [editingProperty, setEditingProperty] =
    useState<PropertyItem | null>(null);

  const [propertyToDelete, setPropertyToDelete] =
    useState<PropertyItem | null>(null);

  const [deleting, setDeleting] = useState(false);

  async function loadProperties() {
    try {
      setLoading(true);

      const data = await getProperties();
      const normalized = data.map(normalizeProperty);

      setProperties(normalized);

      if (normalized.length > 0 && !selectedPropertyId) {
        setSelectedPropertyId(normalized[0].id);
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar imóveis.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProperties();
  }, []);

  const selectedProperty =
    properties.find((property) => property.id === selectedPropertyId) ??
    properties[0];

  async function saveProperty(data: Omit<PropertyItem, "id">) {
    try {
      const payload: PropertyPayload = {
        title: data.title,
        address: data.address,
        city: data.city,
        state: data.state,
        price: currencyBRToNumber(data.price),
        area: Number(onlyNumbers(data.area)),
        bedrooms: data.bedrooms,
        parking_spaces: data.parkingSpaces,
        type: data.type,
        status: data.status,
      };

      if (editingProperty) {
        const updated = await updateProperty(editingProperty.id, payload);
        const normalized = normalizeProperty(updated);

        setProperties((current) =>
          current.map((property) =>
            property.id === editingProperty.id ? normalized : property
          )
        );

        setSelectedPropertyId(normalized.id);
      } else {
        const created = await createProperty(payload);
        const normalized = normalizeProperty(created);

        setProperties((current) => [normalized, ...current]);
        setSelectedPropertyId(normalized.id);
      }

      setEditingProperty(null);
      setShowFormModal(false);
      setShowListModal(false);
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar imóvel.");
    }
  }

  async function handleConfirmDelete() {
    if (!propertyToDelete) return;

    try {
      setDeleting(true);

      await deleteProperty(propertyToDelete.id);

      setProperties((current) =>
        current.filter((property) => property.id !== propertyToDelete.id)
      );

      if (selectedPropertyId === propertyToDelete.id) {
        const nextProperty = properties.find(
          (property) => property.id !== propertyToDelete.id
        );

        setSelectedPropertyId(nextProperty?.id ?? null);
      }

      setPropertyToDelete(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir imóvel.");
    } finally {
      setDeleting(false);
    }
  }

  function openCreateModal() {
    setEditingProperty(null);
    setShowFormModal(true);
  }

  function openEditModal(property: PropertyItem) {
    setEditingProperty(property);
    setShowFormModal(true);
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
        Carregando imóveis...
      </div>
    );
  }

  if (!selectedProperty) {
    return (
      <>
        <div className="rounded-2xl border border-white/10 bg-[#101c2d]/95 p-6 text-center text-slate-400">
          Nenhum imóvel cadastrado.

          <button
            onClick={openCreateModal}
            className="mx-auto mt-4 flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          >
            Adicionar Imóvel
          </button>
        </div>

        {showFormModal && (
          <PropertyFormModal
            editingProperty={editingProperty}
            onSave={saveProperty}
            onClose={() => {
              setEditingProperty(null);
              setShowFormModal(false);
            }}
          />
        )}
      </>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[minmax(0,1fr)_420px] gap-5">
        <section className="space-y-5">
          <PropertyGallery
            property={selectedProperty}
            onOpenList={() => setShowListModal(true)}
          />

          <PropertyNegotiation negotiations={negotiations} />
        </section>

        <aside className="space-y-5">
          <PropertyMap
            properties={properties}
            selectedPropertyId={selectedProperty.id}
            onSelectProperty={setSelectedPropertyId}
          />

          <PropertyVisits visits={visits} />
        </aside>
      </div>

      {showListModal && (
        <PropertyListModal
          properties={properties}
          selectedPropertyId={selectedPropertyId}
          onClose={() => setShowListModal(false)}
          onAdd={openCreateModal}
          onSelect={(property) => {
            setSelectedPropertyId(property.id);
            setShowListModal(false);
          }}
          onEdit={openEditModal}
          onDelete={(property) => setPropertyToDelete(property)}
        />
      )}

      {showFormModal && (
        <PropertyFormModal
          editingProperty={editingProperty}
          onSave={saveProperty}
          onClose={() => {
            setEditingProperty(null);
            setShowFormModal(false);
          }}
        />
      )}

      <ConfirmDeleteModal
        open={!!propertyToDelete}
        itemName={propertyToDelete?.title}
        title="Excluir imóvel"
        description="Tem certeza que deseja excluir este imóvel? Essa ação não poderá ser desfeita."
        loading={deleting}
        onClose={() => setPropertyToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}