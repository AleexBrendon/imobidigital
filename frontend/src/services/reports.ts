import { api } from "./api";
import type { ReportsResponse } from "../types/reports";

export async function getReports() {
  const response = await api.get<ReportsResponse>("/reports");

  return response.data;
}