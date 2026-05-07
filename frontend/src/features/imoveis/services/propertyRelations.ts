import { api } from "../../../services/api";

export type ClientOption = {
  id: number;
  name: string;
};

export type NegotiationPayload = {
  client_id?: number | null;
  stage: string;
  progress?: number;
  status?: string;
};

export type VisitPayload = {
  client_id?: number | null;
  title: string;
  description?: string | null;
  scheduled_at?: string | null;
  status?: string;
};

export async function getClientsOptions(): Promise<ClientOption[]> {
  const response = await api.get("/clients");

  const clients = Array.isArray(response.data)
    ? response.data
    : response.data.data;

  return clients.map((client: any) => ({
    id: client.id,
    name: client.name,
  }));
}

export async function createPropertyNegotiation(
  propertyId: number,
  data: NegotiationPayload
) {
  const response = await api.post(`/properties/${propertyId}/negotiations`, data);
  return response.data;
}

export async function updatePropertyNegotiation(
  negotiationId: number,
  data: Partial<NegotiationPayload>
) {
  const response = await api.put(`/property-negotiations/${negotiationId}`, data);
  return response.data;
}

export async function deletePropertyNegotiation(negotiationId: number) {
  await api.delete(`/property-negotiations/${negotiationId}`);
}

export async function createPropertyVisit(propertyId: number, data: VisitPayload) {
  const response = await api.post(`/properties/${propertyId}/visits`, data);
  return response.data;
}

export async function updatePropertyVisit(
  visitId: number,
  data: Partial<VisitPayload>
) {
  const response = await api.put(`/property-visits/${visitId}`, data);
  return response.data;
}

export async function deletePropertyVisit(visitId: number) {
  await api.delete(`/property-visits/${visitId}`);
}