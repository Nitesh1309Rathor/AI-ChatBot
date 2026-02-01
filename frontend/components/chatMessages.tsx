"use client";

import { useEffect, useRef } from "react";
import type { ChatMessagesProps } from "@/constants/types";

export default function ChatMessages({ messages, hasMore, loading, onLoadMore }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handleScroll() {
    if (!containerRef.current) return;

    if (containerRef.current.scrollTop === 0 && hasMore && !loading) {
      onLoadMore();
    }
  }

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
      {loading && hasMore && <p className="text-center text-sm text-muted-foreground">Loading messages...</p>}

      {messages.filter(Boolean).map((msg) => (
        <div
          key={msg.clientId ?? msg.id}
          className={`max-w-[70%] rounded-lg px-4 py-2 text-sm ${msg.role === "USER" ? "ml-auto bg-primary text-primary-foreground" : "mr-auto bg-muted"}`}
        >
          {msg.content}
        </div>
      ))}
    </div>
  );
}
