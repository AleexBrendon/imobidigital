import { api } from "./api";
import type { ClientActivity } from "../components/clientes/ClientActivityPanel";

export async function getActivities() {
  const { data } = await api.get("/activities");

  return data as ClientActivity[];
}