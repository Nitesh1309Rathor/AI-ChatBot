"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import type { ChatSession } from "@/constants/types";
import ChatsSidebar from "@/components/chatsSidebar";
import { ThemeToggle } from "@/components/theme.toggle";
import ChatMainPanel from "@/components/chatMainPanel";
import { ChatApi } from "@/lib/apiFun/chat";

export default function ChatsPage() {
  const [loading, setLoading] = useState(true);
  const [chats, setChats] = useState<ChatSession[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Loads the all chats of user in sidebar.
  useEffect(() => {
    async function loadChats() {
      try {
        const chats = await ChatApi.getChats();
        console.log("Chats from API:", chats, Array.isArray(chats));
        setChats(chats);
      } finally {
        setLoading(false);
      }
    }
    loadChats();
  }, []);

  // Handle the new chat create button in sidebar.
  async function handleCreateChat() {
    try {
      const chat = await ChatApi.createChat();
      setChats((prev) => [chat, ...prev]);
      setActiveChatId(chat.id);
    } catch {
      console.error("Failed to create chat");
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <aside className="w-72 border-r p-4 h-full overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">Chats</h2>
          <ThemeToggle />
        </div>

        <ChatsSidebar chats={chats} activeChatId={activeChatId} onSelectChat={setActiveChatId} onCreate={handleCreateChat} />
      </aside>

      <main className="flex-1 flex h-full overflow-hidden">
        <ChatMainPanel activeChatId={activeChatId} />
      </main>
    </div>
  );
}
