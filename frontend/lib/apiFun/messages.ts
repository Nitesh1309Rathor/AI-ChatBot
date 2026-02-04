import { Message, PaginatedMessagesResponse } from "@/constants/types";
import { apiFetch } from "../api";
import { LOCAL_STORAGE } from "../auth.storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

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

export async function streamMessage({
  chatSessionId,
  content,
  onToken,
  onDone,
  onError,
}: {
  chatSessionId: string;
  content: string;
  onToken: (chunk: string) => void;
  onDone: () => void;
  onError: (err: unknown) => void;
}) {
  try {
    const token = LOCAL_STORAGE.getToken();
    const res = await fetch(`${API_BASE_URL}/api/chats/${chatSessionId}/messages/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!res.ok || !res.body) {
      throw new Error("Streaming response failed");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const chunk = line.replace("data: ", "");
          onToken(chunk);
        }
      }
    }

    onDone();
  } catch (err) {
    onError(err);
  }
}
