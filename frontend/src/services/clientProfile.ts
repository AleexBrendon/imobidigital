import { api } from "./api";

export async function getClientActivities(clientId: number) {
  const { data } = await api.get(`/clients/${clientId}/activities`);
  return data;
}

export async function getClientDocuments(clientId: number) {
  const { data } = await api.get(`/clients/${clientId}/documents`);
  return data;
}

export async function getClientContracts(clientId: number) {
  const { data } = await api.get(`/clients/${clientId}/contracts`);
  return data;
}

export async function getClientProperties(clientId: number) {
  const { data } = await api.get(`/clients/${clientId}/properties`);
  return data;
}