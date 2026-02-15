"use client";

import { useState, useRef } from "react";
import { Send, Plus, Mic } from "lucide-react";

type ChatInputProps = {
  disabled: boolean;
  onSend?: (content: string) => void;
};

export default function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // stop newline
      handleSend();
    }
  }

  function handleSend() {
    if (!message.trim() || !onSend) return;
    onSend(message.trim());
    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";

    const maxHeight = 160;
    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
  }

  return (
    <div className="max-w-3xl mx-auto px-4">
      <div
        className="
        flex items-center gap-3
        rounded-4xl
        border border-border
        bg-background/60
        backdrop-blur-md
        px-5 py-3
        shadow-xl
        transition-all
        focus-within:ring-1 focus-within:ring-ring
      "
      >
        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Ask anything"
          rows={1}
          className="
  flex-1
  resize-none
  bg-transparent
  outline-none
  text-base
  leading-6
  placeholder:text-muted-foreground/70
  max-h-40
  overflow-hidden
  text-[18px]
"
        />

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          className="
            h-12 w-12
            rounded-full
            hover:bg-muted
            shadow-sm
            flex items-center justify-center
            transition-all
            hover:scale-105
            active:scale-95
            disabled:opacity-40
            cursor-pointer
          "
        >
          <Send size={24} />
        </button>
      </div>
    </div>
  );
}
