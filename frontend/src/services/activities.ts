import { api } from "./api";

export async function getActivities<T = unknown>(params?: {
  subject_type?: string;
  subject_id?: number;
  type?: string;
}) {
  const { data } = await api.get("/activities", {
    params,
  });

  return data as T[];
}