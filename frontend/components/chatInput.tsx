"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

type ChatInputProps = {
  disabled: boolean;
  onSend?: (content: string) => void;
};

function ChatInput({ disabled, onSend }: ChatInputProps) {
  const [message, setMessage] = useState("");

  function handleSend() {
    if (!message.trim() || !onSend) return;
    onSend(message.trim());
    setMessage("");
  }

  return (
    <div className="p-4">
      <div className="flex gap-2 items-center">
        <Textarea
          placeholder={disabled ? "Select a chat to start typing…" : "Type your message…"}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          rows={2}
          className="
  resize-none
  rounded-md
  border
  bg-transparent
  px-3
  py-2
  text-sm
  leading-6
  placeholder:text-muted-foreground
  focus-visible:ring-1
  focus-visible:ring-ring
  focus-visible:ring-offset-0
  mr-5
"
        />

        <button
          onClick={handleSend}
          disabled={disabled || message.trim() === ""}
          className="
    h-14 w-14
    rounded-xl
    bg-zinc-700
    text-primary-foreground
    flex items-center justify-center
    disabled:opacity-50
    disabled:cursor-not-allowed
    cursor-pointer
  "
        >
          <Send size={24} className="text-zinc-100" />
        </button>
      </div>
    </div>
  );
}

export default ChatInput;
