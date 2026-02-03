"use client";

import { useEffect, useRef } from "react";
import type { ChatMessagesProps } from "@/constants/types";

export default function ChatMessages({ messages, hasMore, loading, onLoadMore, onForceScroll }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // controls whether auto-scroll is allowed
  const shouldAutoScrollRef = useRef(true);
  console.log("Ref: ", shouldAutoScrollRef);

  // auto-scroll (only if user is near bottom)
  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // expose FORCE scroll to parent (on user send)
  useEffect(() => {
    if (!onForceScroll) return;

    onForceScroll(() => {
      shouldAutoScrollRef.current = true;
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    });
  }, [onForceScroll]);

  function handleScroll() {
    const el = containerRef.current;
    if (!el) return;

    // detect if user is near bottom
    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;

    shouldAutoScrollRef.current = isNearBottom;

    // pagination trigger
    if (el.scrollTop === 0 && hasMore && !loading) {
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

      <div ref={bottomRef} />
    </div>
  );
}
