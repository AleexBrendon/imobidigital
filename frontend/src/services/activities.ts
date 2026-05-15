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

export type RecentActivity = {
  id: number;
  type: string;
  clientName: string;
  userName: string;
  date: string;
  title: string;
  description?: string | null;
  created_at?: string | null;
};

export async function getRecentActivities() {
  const { data } = await api.get("/activities/recent");

  return data as RecentActivity[];
}

export async function markActivityAsRead(activityId: number) {
  await api.patch(`/activities/${activityId}/read`);
}