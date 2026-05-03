import { api } from "./api";

export type ApiClient = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  type: "Comprador" | "Locador" | "Locatário" | "Investidor";
  status: "Ativo" | "Inativo" | "Lead";
};

export type ClientPayload = {
  name: string;
  email?: string;
  phone?: string;
  type: string;
  status: string;
};

export async function getClients() {
  const { data } = await api.get("/clients");
  return data.data as ApiClient[];
}

export async function createClient(payload: ClientPayload) {
  const { data } = await api.post("/clients", payload);
  return data.data as ApiClient;
}

export async function updateClient(id: number, payload: ClientPayload) {
  const { data } = await api.put(`/clients/${id}`, payload);
  return data.data as ApiClient;
}

export async function deleteClient(id: number) {
  await api.delete(`/clients/${id}`);
}