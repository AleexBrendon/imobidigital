import { api } from "../../../services/api";

export type VisitPayload = {
  client_id?: number | null;
  title: string;
  description?: string | null;
  scheduled_at?: string | null;
  status?: string;
};

export async function createPropertyVisit(
  propertyId: number,
  data: VisitPayload
) {
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