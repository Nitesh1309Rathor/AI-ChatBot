import React from "react";

function ChatArea() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center space-y-4 max-w-md">
        <h1 className="text-3xl font-semibold">Hi, how can I help you?</h1>

        <p className="text-muted-foreground">Start a new conversation or select one from the left.</p>
      </div>
    </div>
  );
}

export default ChatArea;
