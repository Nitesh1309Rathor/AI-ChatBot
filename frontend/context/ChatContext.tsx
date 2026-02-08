"use client";

import { ChatSession } from "@/constants/types";
import { createContext, useContext, useState } from "react";

/* TYPES */

export type Chat = {
  id: string;
  title: string;
};

type ChatsContextType = {
  chats: ChatSession[];
  setChats: React.Dispatch<React.SetStateAction<ChatSession[]>>;
  updateChatTitle: (chatId: string, title: string) => void;
};

/* CONTEXT */

const ChatsContext = createContext<ChatsContextType | null>(null);

/* PROVIDER */

export function ChatsProvider({ children }: { children: React.ReactNode }) {
  const [chats, setChats] = useState<ChatSession[]>([]);

  function updateChatTitle(chatId: string, title: string) {
    setChats((prev) => prev.map((c) => (c.id === chatId ? { ...c, title } : c)));
  }

  return <ChatsContext.Provider value={{ chats, setChats, updateChatTitle }}>{children}</ChatsContext.Provider>;
}

/* HOOK */

export function useChats() {
  const ctx = useContext(ChatsContext);
  if (!ctx) {
    throw new Error("useChats must be used inside ChatsProvider");
  }
  return ctx;
}
