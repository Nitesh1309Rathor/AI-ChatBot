"use client";

import { useParams } from "next/navigation";
import ChatMainPanel from "@/components/chatMainPanel";

export default function ChatPage() {
  const params = useParams();
  const chatId = params.chatId as string;

  return <ChatMainPanel activeChatId={chatId} createLoading={false} />;
}
