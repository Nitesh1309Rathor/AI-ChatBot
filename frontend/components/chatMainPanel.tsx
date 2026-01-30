import { Separator } from "@/components/ui/separator";
import ChatInput from "@/components/chatInput";

type ChatMainPanelProps = {
  activeChatId: string | null;
};

function ChatMainPanel({ activeChatId }: ChatMainPanelProps) {
  const hasActiveChat = Boolean(activeChatId);

  return (
    <div className="flex-1 flex flex-col">
      {/* Header / Greeting */}
      {!hasActiveChat ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-3">
            <h1 className="text-3xl font-semibold">Hi, how can I help you?</h1>
            <p className="text-muted-foreground">Start a new chat or select one from the left.</p>
          </div>
        </div>
      ) : (
        <>
          <div className="px-6 py-4">
            <h2 className="text-lg font-semibold">Conversation</h2>
          </div>
          <Separator />
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">No messages yet. Start the conversation below.</p>
          </div>
        </>
      )}

      <ChatInput disabled={!hasActiveChat} />
    </div>
  );
}

export default ChatMainPanel;
