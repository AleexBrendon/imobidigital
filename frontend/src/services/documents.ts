import { api } from "./api";
import type { DocumentItem } from "../types/document";

function mapDocument(item: any): DocumentItem {
  return {
    id: item.id,
    name: item.name,
    type: item.type,
    status: item.status,
    client: item.client?.name ?? "Sem cliente",
    client_id: item.client_id,
    validationDate: item.validation_date,
    expirationDate: item.expiration_date,
    filePath: item.file_path,
    mimeType: item.mime_type,
    size: item.size,
  };
}

export async function getDocuments(params?: {
  type?: string;
  client_id?: string | number;
  status?: string;
}) {
  const response = await api.get("/documents", { params });
  return response.data.map(mapDocument);
}

export async function uploadDocument(data: FormData) {
  const response = await api.post("/documents", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return mapDocument(response.data);
}

export async function deleteDocument(id: number) {
  await api.delete(`/documents/${id}`);
}

export async function downloadDocumentBlob(id: number) {
  const response = await api.get(`/documents/${id}/download`, {
    responseType: "blob",
  });

  return response.data;
}

export async function updateDocument(
  id: number,
  data: {
    name?: string;
    client_id?: number | null;
    validation_date?: string;
    expiration_date?: string;
  }
) {
  const response = await api.put(`/documents/${id}`, data);

  return mapDocument(response.data);
}