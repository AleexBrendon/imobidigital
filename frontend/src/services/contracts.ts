import { api } from "./api";

export type ContractPayload = {
  client_id?: number | null;
  property_id?: number | null;
  title: string;
  type?: string;
  status?: string;
  start_date?: string | null;
  end_date?: string | null;
  value?: number;
  ai_value?: number;
  fee?: number;
  code?: string | null;
};

export async function getContracts() {
  const response = await api.get("/contracts");
  return response.data;
}

export async function createContract(data: ContractPayload) {
  const response = await api.post("/contracts", data);
  return response.data;
}

export async function updateContract(id: number, data: ContractPayload) {
  const response = await api.put(`/contracts/${id}`, data);
  return response.data;
}

export async function deleteContract(id: number) {
  const response = await api.delete(`/contracts/${id}`);
  return response.data;
}

export async function updateSignatureStep(id: number, completed: boolean) {
  const response = await api.patch(`/signature-steps/${id}`, {
    completed,
  });

  return response.data;
}

export async function updateContractClauseStatus(
  id: number,
  status: "approved" | "pending"
) {
  const response = await api.patch(`/contract-clauses/${id}`, {
    status,
  });

  return response.data;
}