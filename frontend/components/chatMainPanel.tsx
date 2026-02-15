"use client";

import { Separator } from "@/components/ui/separator";
import ChatInput from "@/components/chatInput";
import { useEffect, useRef, useState } from "react";
import { Message } from "@/constants/types";
import { fetchMessages, streamMessage } from "@/lib/apiFun/messages";
import ChatMessages from "./chatMessages";
import { Spinner } from "./ui/spinner";
import { useChats } from "@/context/ChatContext";
import { generateChatTitle } from "@/lib/generateTitle";

type ChatMainPanelProps = {
  activeChatId: string | null;
  createLoading: boolean;
};

function ChatMainPanel({ activeChatId, createLoading }: ChatMainPanelProps) {
  const [historyMessages, setHistoryMessages] = useState<Message[]>([]);
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [aiPending, setAiPending] = useState(false);

  const messagesEndRef = useRef<(() => void) | null>(null);
  const hasActiveChat = Boolean(activeChatId);

  const { chats, updateChatTitle } = useChats();

  // Load messages when chat changes
  useEffect(() => {
    if (!activeChatId) return;

    setHistoryMessages([]);
    setLiveMessages([]); // always reset live messages
    setCursor(null);
    setHasMore(true);

    loadMessages(activeChatId);
  }, [activeChatId]);

  async function loadMessages(chatId: string) {
    setLoading(true);

    const data = await fetchMessages(chatId);

    setHistoryMessages(data.messages);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);

    setLoading(false);
  }

  async function loadMoreMessages() {
    if (!activeChatId || !hasMore || loading) return;

    setLoading(true);

    const data = await fetchMessages(activeChatId, cursor || undefined);

    setHistoryMessages((prev) => [...data.messages, ...prev]);
    setCursor(data.nextCursor);
    setHasMore(data.hasMore);

    setLoading(false);
  }

  // SEND + STREAM MESSAGE
  async function handleSendMessage(content: string) {
    if (!activeChatId || aiPending) return;
    setAiPending(true);

    const isFirstMsg = historyMessages.length == 0 && liveMessages.length == 0;

    if (isFirstMsg) {
      const title = generateChatTitle(content);
      updateChatTitle(activeChatId, title);
    }

    const clientId = crypto.randomUUID();
    const now = new Date().toISOString();

    const userMessage: Message = {
      id: clientId,
      clientId,
      chatSessionId: activeChatId,
      role: "USER",
      content,
      createdAt: now,
      optimistic: true,
    };

    const aiMessageId = `ai-${clientId}`;

    const aiMessage: Message = {
      id: aiMessageId,
      chatSessionId: activeChatId,
      role: "ASSISTANT",
      content: "",
      createdAt: now,
      optimistic: true,
    };

    // add ONLY one AI message for streaming
    setLiveMessages((prev) => [...prev, userMessage, aiMessage]);

    try {
      await streamMessage({
        chatSessionId: activeChatId,
        content,

        // stream tokens into the SAME AI message
        onToken(chunk) {
          setLiveMessages((prev) => prev.map((m) => (m.id === aiMessageId ? { ...m, content: m.content + chunk } : m)));
        },

        onDone() {
          setAiPending(false);
        },

        onError(err) {
          console.error(err);
          setAiPending(false);
          setLiveMessages([]); // safety cleanup
        },
      });
    } catch (err) {
      console.error(err);
      setAiPending(false);
      setLiveMessages([]);
    }
  }

  // FINAL MESSAGE LIST
  const messages = [...historyMessages, ...liveMessages];

  if (loading && messages.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto pb-32  mb-2">
        {messages.length > 0 ? (
          <ChatMessages
            messages={messages}
            hasMore={hasMore}
            loading={loading}
            onLoadMore={loadMoreMessages}
            onForceScroll={(fn) => {
              messagesEndRef.current = fn;
            }}
          />
        ) : (
          !loading && (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">No messages yet. Start the conversation below.</p>
            </div>
          )
        )}
      </div>

      {/* Floating Input */}
      <div className="absolute bottom-6 left-0 right-0">
        <ChatInput disabled={!hasActiveChat || aiPending} onSend={handleSendMessage} />
      </div>
    </div>
  );
}

export default ChatMainPanel;
