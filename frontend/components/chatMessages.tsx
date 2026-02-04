"use client";

import { useEffect, useRef } from "react";
import type { ChatMessagesProps } from "@/constants/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatMessages({ messages, hasMore, loading, onLoadMore, onForceScroll }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // controls whether auto-scroll is allowed
  const shouldAutoScrollRef = useRef(true);

  // auto-scroll (only if user is near bottom)
  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;

    // only scroll if last message is assistant OR new message added
    const last = messages[messages.length - 1];
    if (!last || last.role !== "ASSISTANT") return;

    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

  // expose FORCE scroll to parent (on user send)
  useEffect(() => {
    if (!onForceScroll) return;

    onForceScroll(() => {
      shouldAutoScrollRef.current = true;
      bottomRef.current?.scrollIntoView({ behavior: "auto" });
    });
  }, []);

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
          className={`
    group relative max-w-[75%] px-4 py-3 text-sm leading-relaxed
    rounded-2xl transition-all
    ${
      msg.role === "USER"
        ? "ml-auto bg-linear-to-br from-primary to-primary/80 text-primary-foreground shadow-md"
        : "mr-auto bg-zinc-800/90 text-zinc-100 shadow-sm"
    }
  `}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
