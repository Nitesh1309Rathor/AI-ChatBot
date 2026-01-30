import { apiFetch } from "@/lib/api";
import type { ChatsApiResponse, ChatSession, CreateChatApiResponse } from "@/constants/types";

export const ChatApi = {
  async getChats(): Promise<ChatSession[]> {
    const res = await apiFetch<ChatsApiResponse>("/api/chats");
    return res.data.chats;
  },

  async createChat(): Promise<ChatSession> {
    const res = await apiFetch<CreateChatApiResponse>("/api/chats", {
      method: "POST",
    });
    return res.data;
  },
};
