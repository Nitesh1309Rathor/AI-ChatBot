"use client";

import { useEffect, useRef } from "react";
import type { ChatMessagesProps } from "@/constants/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

export default function ChatMessages({ messages, hasMore, loading, onLoadMore, onForceScroll }: ChatMessagesProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const shouldAutoScrollRef = useRef(true);

  useEffect(() => {
    if (!shouldAutoScrollRef.current) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "ASSISTANT") return;
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages]);

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

    const isNearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 120;

    shouldAutoScrollRef.current = isNearBottom;

    if (el.scrollTop === 0 && hasMore && !loading) {
      onLoadMore();
    }
  }

  return (
    <div ref={containerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
      {loading && hasMore && <p className="text-center text-sm text-muted-foreground">Loading messages...</p>}

      {messages.filter(Boolean).map((msg) => (
        <div key={msg.clientId ?? msg.id} className={`flex ${msg.role === "USER" ? "justify-end" : "justify-start"}`}>
          <div
            className={`
              max-w-[75%] w-fit
              px-5 py-1
              rounded-2xl
              text-[18px] leading-10
              wrap-break-words break-all
              transition-all
              ${
                msg.role === "USER" ? "bg-linear-to-r from-gray-600 to-gray-700 text-white shadow-lg" : "bg-card text-foreground shadow-sm border border-border"
              }
            `}
          >
            {msg.role === "ASSISTANT" && msg.content === "" ? (
              <span className="italic text-muted-foreground">Thinking…</span>
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkGfm, remarkBreaks]}
                components={{
                  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-3">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-3">{children}</ol>,
                  li: ({ children }) => <li className="mb-1">{children}</li>,
                  code(props) {
                    const { children, className } = props;
                    const isInline = !className;

                    if (isInline) {
                      return <code className="bg-muted px-1 py-0.5 rounded text-sm">{children}</code>;
                    }

                    return (
                      <pre className="bg-black text-white p-4 rounded-xl overflow-x-auto text-sm mb-3">
                        <code>{children}</code>
                      </pre>
                    );
                  },
                }}
              >
                {msg.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
}
