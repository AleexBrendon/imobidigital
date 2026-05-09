import { api } from "../../../services/api";

export type NegotiationPayload = {
  client_id?: number | null;
  stage: string;
  progress?: number;
  status?: string;
};

export async function createPropertyNegotiation(
  propertyId: number,
  data: NegotiationPayload
) {
  const response = await api.post(
    `/properties/${propertyId}/negotiations`,
    data
  );

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

export async function updateNegotiationStage(id: number, stage: string) {
  const response = await api.patch(`/property-negotiations/${id}/stage`, {
    stage,
  });

  return response.data;
}