import { api } from "../services/api";

function getCompanyName() {
  return "ImobiDigital";
}

export async function sendBotMessage(
  message: string,
  conversationId?: number | null
) {
  const response = await api.post("/public-bot/message", {
    company_name: getCompanyName(),
    conversation_id: conversationId,
    message,
  });

  return response.data;
}