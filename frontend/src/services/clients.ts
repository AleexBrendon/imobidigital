import { api } from "./api";

export type ClientPayload = {
  document: string;
  name: string;
  email?: string;
  phone?: string;
  type: string;
  status: string;
  image?: File | null;
};

function toFormData(payload: ClientPayload) {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("email", payload.email ?? "");
  formData.append("phone", payload.phone ?? "");
  formData.append("document", payload.document ?? "");
  formData.append("type", payload.type);
  formData.append("status", payload.status);

  if (payload.image) {
    formData.append("image", payload.image);
  }

  return formData;
}

export async function getClients() {
  const { data } = await api.get("/clients");

  return data.data ?? data;
}

export async function createClient(payload: ClientPayload) {
  const { data } = await api.post("/clients", toFormData(payload), {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data ?? data;
}

export async function updateClient(id: number, payload: ClientPayload) {
  const formData = toFormData(payload);
  formData.append("_method", "PUT");

  const { data } = await api.post(`/clients/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data.data ?? data;
}

export async function deleteClient(id: number) {
  const { data } = await api.delete(`/clients/${id}`);

  return data;
}