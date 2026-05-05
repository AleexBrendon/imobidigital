import type {
  ContractClause,
  ContractDetails,
  ContractDocument,
  SignatureEvent,
  SignatureStep,
} from "../../../types/contract";
import type { ApiContract } from "../types/apiContract";

export function formatCurrency(value: unknown) {
  return Number(value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

export function formatDate(value?: string | null) {
  if (!value) return "-";

  return new Date(value).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
}

export function normalizeClauses(contract: ApiContract): ContractClause[] {
  return (contract.clauses ?? []).map((clause: any) => ({
    id: clause.id,
    contractId: contract.id,
    title: clause.title,
    description: clause.description ?? "",
    status: clause.status === "approved" ? "approved" : "pending",
    expanded: Boolean(clause.expanded),
  }));
}

export function normalizeSteps(contract: ApiContract): SignatureStep[] {
  return (contract.signature_steps ?? contract.signatureSteps ?? []).map(
    (step: any) => ({
      id: step.id,
      label: step.label,
      completed: Boolean(step.completed),
    })
  );
}

export function normalizeEvents(contract: ApiContract): SignatureEvent[] {
  return (contract.signature_events ?? contract.signatureEvents ?? []).map(
    (event: any) => ({
      id: event.id,
      time: event.time ?? "-",
      title: event.title,
      description: event.description ?? "",
      completed: Boolean(event.completed),
    })
  );
}

export function normalizeDocuments(contract: ApiContract): ContractDocument[] {
  if (contract.documents?.length) {
    return contract.documents.map((document: any) => ({
      id: document.id,
      title: document.title ?? document.name ?? "Documento",
      status: document.status ?? "Pendente",
    }));
  }

  return [
    {
        id: 1,
        title: "Documentação do contrato",
        status: contract.status ?? "Pendente",
        color: "emerald"
    },
  ];
}

export function normalizeDetails(contract: ApiContract): ContractDetails {
  return {
    id: contract.id,
    title: contract.title ?? "Contrato sem título",
    startDate: formatDate(contract.start_date),
    endDate: formatDate(contract.end_date),
    value: formatCurrency(contract.value),
    fee: formatCurrency(contract.fee),
    aiValue: formatCurrency(contract.ai_value),
    property: contract.property?.title ?? "Sem imóvel vinculado",
    code: contract.code ?? `CTR-${contract.id}`,
    category: contract.type ?? "Contrato",
  };
}