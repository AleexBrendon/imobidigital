import { useEffect, useState } from "react";
import {
    createProperty,
    deleteProperty,
    getProperties,
    updateProperty,
    type PropertyPayload,
} from "../../../services/properties";
import {
    createPropertyNegotiation,
    createPropertyVisit,
    deletePropertyNegotiation,
    deletePropertyVisit,
    getClientsOptions,
    updatePropertyNegotiation,
    updatePropertyVisit,
    type ClientOption,
    type NegotiationPayload,
    type VisitPayload,
} from "../services/propertyRelations";
import type { PropertyItem } from "../../../types/property";
import { currencyBRToNumber, onlyNumbers } from "../../../utils/format";
import type { PropertyFormData } from "../types/propertyForm";
import { normalizeProperty } from "../utils/normalizeProperty";

export function useProperties() {
    const [clients, setClients] = useState<ClientOption[]>([]);

    const [properties, setProperties] = useState<PropertyItem[]>([]);
    const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
        null
    );

    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const [showListModal, setShowListModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);

    const [editingProperty, setEditingProperty] =
        useState<PropertyItem | null>(null);

    const [propertyToDelete, setPropertyToDelete] =
        useState<PropertyItem | null>(null);

    const selectedProperty =
        properties.find((property) => property.id === selectedPropertyId) ??
        properties[0];

    async function loadProperties() {

        const [propertiesData, clientsData] = await Promise.all([
            getProperties(),
            getClientsOptions(),
        ]);

        const normalized = propertiesData.map(normalizeProperty);

        setProperties(normalized);
        setClients(clientsData);

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

    async function saveNegotiation(
        propertyId: number,
        negotiationId: number | null,
        data: NegotiationPayload
    ) {
        if (negotiationId) {
            await updatePropertyNegotiation(negotiationId, data);
        } else {
            await createPropertyNegotiation(propertyId, data);
        }

        await loadProperties();
    }

    async function removeNegotiation(negotiationId: number) {
        const confirmed = confirm("Deseja remover esta negociação?");
        if (!confirmed) return;

        await deletePropertyNegotiation(negotiationId);
        await loadProperties();
    }

    async function saveVisit(
        propertyId: number,
        visitId: number | null,
        data: VisitPayload
    ) {
        if (visitId) {
            await updatePropertyVisit(visitId, data);
        } else {
            await createPropertyVisit(propertyId, data);
        }

        await loadProperties();
    }

    async function removeVisit(visitId: number) {
        const confirmed = confirm("Deseja remover esta visita?");
        if (!confirmed) return;

        await deletePropertyVisit(visitId);
        await loadProperties();
    }

    async function saveProperty(data: PropertyFormData) {
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

            closeFormModal();
            setShowListModal(false);
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar imóvel.");
        }
    }

    async function confirmDeleteProperty() {
        if (!propertyToDelete) return;

        try {
            setDeleting(true);

            await deleteProperty(propertyToDelete.id);

            setProperties((current) => {
                const updated = current.filter(
                    (property) => property.id !== propertyToDelete.id
                );

                if (selectedPropertyId === propertyToDelete.id) {
                    setSelectedPropertyId(updated[0]?.id ?? null);
                }

                return updated;
            });

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

    function closeFormModal() {
        setEditingProperty(null);
        setShowFormModal(false);
    }

    return {
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
    };

}