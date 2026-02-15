"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import type { ChatSession } from "@/constants/types";
import ChatsSidebar from "@/components/chatsSidebar";
import { ThemeToggle } from "@/components/theme.toggle";
import ChatMainPanel from "@/components/chatMainPanel";
import { ChatApi } from "@/lib/apiFun/chat";
import { useChats } from "@/context/ChatContext";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth.guard";
import { Button } from "@/components/ui/button";
import { LOCAL_STORAGE } from "@/lib/auth.storage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Menu } from "lucide-react";

export default function ChatsPage() {
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { chats, setChats } = useChats();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    async function loadChats() {
      try {
        const chats = await ChatApi.getChats();
        setChats(chats);
      } finally {
        setPageLoading(false);
      }
    }

    loadChats();
  }, [router]);

  async function handleCreateChat() {
    try {
      setCreateLoading(true);
      const chat = await ChatApi.createChat();
      setChats((prev) => [chat, ...prev]);
      setActiveChatId(chat.id);
      setSidebarOpen(false);
    } finally {
      setCreateLoading(false);
    }
  }

  function handleLogout() {
    LOCAL_STORAGE.removeToken();
    router.replace("/login");
  }

  if (pageLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-50
          h-full
          w-64 md:w-72 lg:w-80
          bg-card border-r border-border
          p-4
          flex flex-col
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-lg">Chats</h2>
          <ThemeToggle />
        </div>

        <ChatsSidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => {
            setActiveChatId(id);
            setSidebarOpen(false);
          }}
          onCreate={handleCreateChat}
          createLoading={createLoading}
        />
      </aside>

      {/* Main Section */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-card">
          {/* Left Section */}
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>

            <a href="/">
              <h3 className="font-semibold text-base sm:text-lg cursor-pointer">Helping Hand</h3>
            </a>
          </div>

          {/* Right Section */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 cursor-pointer">
                Logout
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to log out of your account?</AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-destructive text-destructive-foreground" onClick={handleLogout}>
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <ChatMainPanel activeChatId={activeChatId} createLoading={createLoading} />
        </div>
      </main>
    </div>
  );
}
