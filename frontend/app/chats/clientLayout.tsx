"use client";

import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import ChatsSidebar from "@/components/chatsSidebar";
import { ThemeToggle } from "@/components/theme.toggle";
import { useChats } from "@/context/ChatContext";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
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
import { apiFetch } from "@/lib/api";
import { ChatApi } from "@/lib/apiFun/chat";

export default function ChatsLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const activeChatId = params?.chatId as string | null;
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const { chats, setChats } = useChats();

  useEffect(() => {
    async function loadChats() {
      try {
        const chats = await ChatApi.getChats();
        setChats(chats);
      } catch {
        router.replace("/login");
      } finally {
        setPageLoading(false);
      }
    }
    loadChats();
  }, []);

  async function handleCreateChat() {
    setCreateLoading(true);
    const chat = await ChatApi.createChat();
    setChats((prev) => [chat, ...prev]);
    router.push(`/chats/${chat.id}`);
    setSidebarOpen(false);
    setCreateLoading(false);
  }

  async function handleLogout() {
    try {
      setLogoutLoading(true);
      await apiFetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
    } catch (err) {
      console.error(err);
      setLogoutLoading(false);
    }
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
      {logoutLoading && (
        <div className="fixed inset-0 z-100 bg-background/80 backdrop-blur-sm flex items-center justify-center">
          <Spinner />
        </div>
      )}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setSidebarOpen(false)} />}

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
            router.push(`/chats/${id}`);
            setSidebarOpen(false);
          }}
          onCreate={handleCreateChat}
          createLoading={createLoading}
        />
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-card">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <h3 className="font-semibold text-base sm:text-lg">Helping Hand</h3>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-red-500 hover:bg-red-500/10 cursor-pointer" disabled={logoutLoading}>
                Logout
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                <AlertDialogDescription>Are you sure you want to log out?</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLogout} className="cursor-pointer">
                  Logout
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  );
}
