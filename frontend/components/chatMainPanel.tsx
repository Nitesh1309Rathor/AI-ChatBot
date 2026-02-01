"use client";

import { Separator } from "@/components/ui/separator";
import ChatInput from "@/components/chatInput";
import { useEffect, useState } from "react";
import { Message } from "@/constants/types";
import { fetchMessages, sendMessage } from "@/lib/apiFun/messages";
import ChatMessages from "./chatMessages";
import { Spinner } from "./ui/spinner";

type ChatMainPanelProps = {
  activeChatId: string | null;
};

function ChatMainPanel({ activeChatId }: ChatMainPanelProps) {
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);

  const [liveMessages, setLiveMessages] = useState<Message[]>([]);

  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const hasActiveChat = Boolean(activeChatId);

  // Load Previous Messages.
  useEffect(() => {
    if (!activeChatId) return;

    setHistoryMessages([]);
    setLiveMessages([]);
    setCursor(null);
    setHasMore(true);

    loadMessages(activeChatId);
  }, [activeChatId]);

  async function loadMessages(chatId: string) {
    setLoading(true);

    const data = await fetchMessages(chatId);
    console.log(data);

    setHistoryMessages(data.messages);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);

    setLoading(false);
  }

  // Load prev messages on scroll.
  async function loadMoreMessages() {
    if (!activeChatId || !hasMore || loading) return;

    setLoading(true);

    const data = await fetchMessages(activeChatId, cursor || undefined);

    setHistoryMessages((prev) => [...data.messages, ...prev]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);

    setLoading(false);
  }

  // Handle new message send.
  // All the send messages goes to live messages.
  async function handleSendMessage(content: string) {
    if (!activeChatId) return;

    const clientId = crypto.randomUUID();

    const optimisticMessage: Message = {
      id: clientId,
      clientId,
      chatSessionId: activeChatId,
      role: "USER",
      content,
      createdAt: new Date().toISOString(),
      optimistic: true,
    };

    setLiveMessages((prev) => [...prev, optimisticMessage]);

    try {
      const res = await sendMessage(activeChatId, content, clientId);

      setLiveMessages((prev) => {
        const withoutOptimistic = prev.filter((m) => m.clientId !== clientId);

        return [...withoutOptimistic, res.userMessage, res.aiMessage];
      });
    } catch (err) {
      setLiveMessages((prev) => prev.filter((m) => m.clientId !== clientId));
      console.error(err);
    }
  }

  // Combine the History of db messages and this current session messages from live messages.
  const messages = [...historyMessages, ...liveMessages];

  if (loading && messages.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {!hasActiveChat ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-semibold">Hi, how can I help you?</h1>
            <p className="text-muted-foreground">Start a new chat or select one from the left.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold">Conversation</h2>
          </div>
          <Separator />

          {messages.length > 0 ? (
            <ChatMessages messages={messages} hasMore={hasMore} loading={loading} onLoadMore={loadMoreMessages} />
          ) : (
            !loading && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-muted-foreground">No messages yet. Start the conversation below.</p>
              </div>
            )
          )}
        </>
      )}

      <ChatInput disabled={!hasActiveChat} onSend={handleSendMessage} />
    </div>
  );
}

export default ChatMainPanel;
