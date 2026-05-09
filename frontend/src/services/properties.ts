import { api } from "./api";
import type { PropertyStatus, PropertyType } from "../types/property";

export type PropertyPayload = {
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  area: number;
  bedrooms: number;
  parking_spaces: number;
  type: PropertyType;
  status: PropertyStatus;
};

export type NegotiationPayload = {
  stage: string;
  progress: number;
  status: string;
};

export async function getProperties() {
  const response = await api.get("/properties");
  return response.data;
}

export async function createProperty(data: PropertyPayload) {
  const response = await api.post("/properties", data);
  return response.data;
}

export async function updateProperty(id: number, data: PropertyPayload) {
  const response = await api.put(`/properties/${id}`, data);
  return response.data;
}

export async function deleteProperty(id: number) {
  const response = await api.delete(`/properties/${id}`);
  return response.data;
}

export async function updateNegotiation(
  id: number,
  data: NegotiationPayload
) {
  const response = await api.put(`/property-negotiations/${id}`, data);
  return response.data;
}