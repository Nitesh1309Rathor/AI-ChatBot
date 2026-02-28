import type { ChatSession } from "@/constants/types";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import AnimatedChatTitle from "./AnimatedTitle";
import { Spinner } from "./ui/spinner";

type ChatsSidebarProps = {
  chats?: ChatSession[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onCreate: () => void;
  createLoading: boolean;
};

function ChatsSidebar({ chats = [], activeChatId, onSelectChat, onCreate, createLoading }: ChatsSidebarProps) {
  const truncateTitle = (title: string, maxLength = 30) => {
    if (!title) return "New conversation";
    return title.length > maxLength ? title.slice(0, maxLength) + "..." : title;
  };
  return (
    <div className="h-full py-4 flex flex-col text-[18px]">
      <Button
        variant="outline"
        className={cn("mb-8 py-6 text-[18px]", createLoading ? "justify-center" : "justify-start", "cursor-pointer")}
        onClick={onCreate}
      >
        {createLoading ? <Spinner /> : "+ New chat"}
      </Button>

      {/* Chat list */}
      <ScrollArea className="flex-1">
        {chats.length === 0 ? (
          <p className="px-1 text-[18px] text-muted-foreground">No conversations yet</p>
        ) : (
          <div className="space-y-1">
            {chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              const shouldAnimate = !!(chat.title && chat.title !== "New conversation" && chat.id === activeChatId);

              return (
                <button
                  key={chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  className={cn(
                    "w-full rounded-md px-3 py-2 text-left transition-colors",
                    "hover:bg-muted/70 cursor-pointer",
                    isActive ? "bg-muted font-semibold text-foreground" : "text-muted-foreground",
                  )}
                >
                  <span className="block truncate">
                    <AnimatedChatTitle text={truncateTitle(chat.title ?? "New conversation")} animate={shouldAnimate} />
                  </span>
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
