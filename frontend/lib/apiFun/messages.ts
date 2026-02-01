import { Message, PaginatedMessagesResponse } from "@/constants/types";
import { apiFetch } from "../api";

export async function fetchMessages(chatSessionId: string, cursor?: string, limit = 20): Promise<PaginatedMessagesResponse> {
  const params = new URLSearchParams();
  if (cursor) params.append("cursor", cursor);
  params.append("limit", String(limit));

  const query = params.toString();
  const endpoint = `/api/chats/${chatSessionId}/messages${query ? `?${query}` : ""}`;

  const response = await apiFetch<{
    message: string;
    data: PaginatedMessagesResponse;
  }>(endpoint);

  return response.data;
}

export async function sendMessage(chatSessionId: string, content: string, clientId: string): Promise<{ userMessage: Message; aiMessage: Message }> {
  return apiFetch<{
    message: string;
    data: {
      userMessage: Message;
      aiMessage: Message;
    };
  }>(`/api/chats/${chatSessionId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content, clientId }),
  }).then((res) => res.data);
}
