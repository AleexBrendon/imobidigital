import { api } from "./api";

export type PublicBotNotification = {
  id: number;
  category: "cadastro" | "documento" | "imovel";
  title: string;
  message: string | null;
  read: boolean;
  data?: {
    name?: string;
    phone?: string;
    document?: string;
  };
  created_at: string;
};

export async function getPublicBotNotifications() {
  const response = await api.get<PublicBotNotification[]>(
    "/public-bot-notifications"
  );

  return Array.isArray(response.data) ? response.data : [];
}