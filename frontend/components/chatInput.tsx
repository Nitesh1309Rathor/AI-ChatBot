"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

type ChatInputProps = {
  disabled: boolean;
};

function ChatInput({ disabled }: ChatInputProps) {
  const [message, setMessage] = useState("");

  return (
    <div className="border-t p-4">
      <div className="flex gap-2">
        <Textarea
          placeholder={disabled ? "Select a chat to start typing..." : "Type your message..."}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={disabled}
          className="resize-none"
          rows={2}
        />

        <Button disabled={disabled || message.trim() === ""} className="self-end">
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default ChatInput;
