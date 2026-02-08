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

export async function streamMessage({
  chatSessionId,
  content,
  onToken,
  onMeta,
  onDone,
  onError,
}: {
  chatSessionId: string;
  content: string;
  onToken: (chunk: string) => void;
  onMeta?: (meta: { chatSessionId: string; chatTitle?: string; userMessage?: Message }) => void;
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

      const events = buffer.split("\n\n");
      buffer = events.pop() || "";

      for (const event of events) {
        // META EVENT
        if (event.startsWith("event: meta")) {
          const dataLine = event.split("\n").find((l) => l.startsWith("data: "));

          if (dataLine) {
            const meta = JSON.parse(dataLine.replace("data: ", ""));
            onMeta?.(meta);
          }
          continue;
        }

        // TOKEN EVENT
        if (event.startsWith("data: ")) {
          onToken(event.replace("data: ", ""));
        }
      }
    }

    onDone();
  } catch (err) {
    onError(err);
  }
}
