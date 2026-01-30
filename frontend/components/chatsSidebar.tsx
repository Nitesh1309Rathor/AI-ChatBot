import type { ChatSession } from "@/constants/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type ChatsSidebarProps = {
  chats?: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onCreate: () => void;
};

function ChatsSidebar({ chats = [], activeChatId, onSelectChat, onCreate }: ChatsSidebarProps) {
  return (
    <div className="h-full p-4 flex flex-col">
      {/* New Chat */}
      <Button variant="outline" className="mb-4 justify-start" onClick={onCreate}>
        + New chat
      </Button>

      {/* Chat list */}
      <ScrollArea className="flex-1">
        {chats.length === 0 ? (
          <p className="px-1 text-sm text-muted-foreground">No conversations yet</p>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => {
              const isActive = chat.id === activeChatId;

              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={cn("w-full rounded-md px-3 py-2 text-left text-sm transition-colors", "hover:bg-muted", isActive && "bg-muted font-medium")}
                >
                  {chat.title ?? "New conversation"}
                </button>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

export default ChatsSidebar;
