import { useEffect, useMemo, useState } from "react";

import {
    getContracts,
    createContract,
    updateContract,
    deleteContract,
    updateContractClauseStatus,
    updateSignatureStep,
    type ContractPayload,
} from "../../../services/contracts";

import { getClients } from "../../../services/clients";
import { getProperties } from "../../../services/properties";

import {
    normalizeClauses,
    normalizeSteps,
    normalizeEvents,
    normalizeDocuments,
    normalizeDetails,
} from "../utils/contractMappers";

import type {
    ContractClause,
    SignatureEvent,
    SignatureStep,
    ContractDocument,
} from "../../../types/contract";

import type {
    ApiContract,
    SelectedContractView,
} from "../types/apiContract";

import { currencyBRToNumber } from "../../../utils/format";
import { useToast } from "../../../contexts/ToastContext";

export function useContractsPage() {
    const toast = useToast();

    const [contracts, setContracts] = useState<ApiContract[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [properties, setProperties] = useState<any[]>([]);

    const [clauses, setClauses] = useState<ContractClause[]>([]);
    const [steps, setSteps] = useState<SignatureStep[]>([]);
    const [events, setEvents] = useState<SignatureEvent[]>([]);
    const [documents, setDocuments] = useState<ContractDocument[]>([]);

    const [selectedContractId, setSelectedContractId] = useState<number | null>(
        null
    );
    const [selectedClauseId, setSelectedClauseId] = useState<number | null>(null);
    const [selectedType, setSelectedType] =
        useState<SelectedContractView>(null);

    const [filter, setFilter] = useState<"all" | "pending">("all");
    const [loading, setLoading] = useState(true);

    const [showListModal, setShowListModal] = useState(false);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editingContract, setEditingContract] =
        useState<ApiContract | null>(null);

    const [contractToDelete, setContractToDelete] =
        useState<ApiContract | null>(null);

    const [deleting, setDeleting] = useState(false);

    async function loadContracts() {
        try {
            setLoading(true);

            const [contractsData, clientsData, propertiesData] =
                await Promise.all([
                    getContracts(),
                    getClients(),
                    getProperties(),
                ]);

            setContracts(contractsData);
            setClients(clientsData);
            setProperties(propertiesData);

            if (contractsData.length > 0) {
                selectContract(contractsData[0]);
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro ao carregar contratos");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadContracts();
    }, []);

    function selectContract(contract: ApiContract) {
        setSelectedContractId(contract.id);
        setClauses(normalizeClauses(contract));
        setSteps(normalizeSteps(contract));
        setEvents(normalizeEvents(contract));
        setDocuments(normalizeDocuments(contract));
    }

    function selectContractView(contract: ApiContract) {
        selectContract(contract);
        setSelectedType("contract");
        setSelectedClauseId(null);
    }

    function selectClause(contract: ApiContract, clause: ContractClause) {
        if (contract.id !== selectedContractId) {
            selectContract(contract);
        }

        setSelectedType("clause");
        setSelectedContractId(contract.id);
        setSelectedClauseId(clause.id);
    }

    function clearDetails() {
        setSelectedType(null);
        setSelectedClauseId(null);
    }

    async function toggleClauseStatus(id: number) {
        const clause =
            clauses.find((item) => item.id === id) ??
            contracts
                .flatMap((contract) => contract.clauses ?? [])
                .find((item: any) => item.id === id);

        if (!clause) return;

        const oldStatus = clause.status === "approved" ? "approved" : "pending";
        const newStatus = oldStatus === "approved" ? "pending" : "approved";

        setClauses((current) =>
            current.map((item) =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );

        setContracts((current) =>
            current.map((contract) => ({
                ...contract,
                clauses: (contract.clauses ?? []).map((item: any) =>
                    item.id === id ? { ...item, status: newStatus } : item
                ),
            }))
        );

        try {
            await updateContractClauseStatus(id, newStatus);

            toast.success(
                newStatus === "approved"
                    ? "Cláusula aprovada com sucesso."
                    : "Cláusula marcada como pendente."
            );
        } catch (error) {
            console.error(error);

            setClauses((current) =>
                current.map((item) =>
                    item.id === id ? { ...item, status: oldStatus } : item
                )
            );

            setContracts((current) =>
                current.map((contract) => ({
                    ...contract,
                    clauses: (contract.clauses ?? []).map((item: any) =>
                        item.id === id ? { ...item, status: oldStatus } : item
                    ),
                }))
            );

            toast.error("Erro ao atualizar cláusula.");
        }
    }

    async function toggleStep(id: number) {
        const step = steps.find((s) => s.id === id);
        if (!step) return;

        const newValue = !step.completed;

        setSteps((current) =>
            current.map((s) =>
                s.id === id ? { ...s, completed: newValue } : s
            )
        );

        try {
            const response = await updateSignatureStep(id, newValue);

            if (response.event) {
                setEvents((prev) => [response.event, ...prev]);
            }

            toast.success("Assinatura registrada");
        } catch {
            toast.error("Erro ao atualizar assinatura");
        }
    }

    async function saveContract(data: any) {
        const payload: ContractPayload = {
            client_id: data.client_id,
            property_id: data.property_id,
            title: data.title,
            type: data.type,
            status: data.status,
            start_date: data.start_date || null,
            end_date: data.end_date || null,
            value: currencyBRToNumber(data.value),
            ai_value: currencyBRToNumber(data.ai_value),
            fee: currencyBRToNumber(data.fee),
            code: data.code || null,
        };

        try {
            if (editingContract) {
                const updated = await updateContract(
                    editingContract.id,
                    payload
                );

                setContracts((prev) =>
                    prev.map((c) =>
                        c.id === editingContract.id ? updated : c
                    )
                );

                toast.success("Atualizado");
            } else {
                const created = await createContract(payload);

                setContracts((prev) => [created, ...prev]);

                toast.success("Criado");
            }

            setShowFormModal(false);
            setEditingContract(null);
        } catch {
            toast.error("Erro ao salvar");
        }
    }

    async function confirmDelete() {
        if (!contractToDelete) return;

        try {
            setDeleting(true);

            await deleteContract(contractToDelete.id);

            setContracts((prev) =>
                prev.filter((c) => c.id !== contractToDelete.id)
            );

            setContractToDelete(null);

            toast.success("Deletado");
        } catch {
            toast.error("Erro ao deletar");
        } finally {
            setDeleting(false);
        }
    }

    const selectedContract = useMemo(
        () =>
            contracts.find((c) => c.id === selectedContractId) ??
            null,
        [contracts, selectedContractId]
    );

    const selectedClause = useMemo(
        () => clauses.find((c) => c.id === selectedClauseId) ?? null,
        [clauses, selectedClauseId]
    );

    const selectedDetails = selectedContract
        ? normalizeDetails(selectedContract)
        : null;

    function toggleClauseExpanded(id: number) {
        setClauses((current) =>
            current.map((clause) =>
                clause.id === id
                    ? { ...clause, expanded: !clause.expanded }
                    : clause
            )
        );

        setContracts((current) =>
            current.map((contract) => ({
                ...contract,
                clauses: (contract.clauses ?? []).map((clause: any) =>
                    clause.id === id
                        ? { ...clause, expanded: !Boolean(clause.expanded) }
                        : clause
                ),
            }))
        );
    }

    return {
        contracts,
        clients,
        properties,

        clauses,
        steps,
        events,
        documents,

        selectedContractId,
        selectedClauseId,
        selectedType,
        selectedClause,
        selectedDetails,

        filter,
        loading,

        showListModal,
        showFormModal,
        editingContract,
        contractToDelete,
        deleting,

        setFilter,
        setShowListModal,
        setShowFormModal,
        setEditingContract,
        setContractToDelete,

        selectContractView,
        selectClause,
        clearDetails,
        toggleClauseStatus,
        toggleClauseExpanded,
        toggleStep,

        saveContract,
        confirmDelete,
    };
}