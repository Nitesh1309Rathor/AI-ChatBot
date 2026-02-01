export interface ChatSession {
  id: string;
  userId: string;
  title: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
}

export interface LoginApiResponse {
  message: string;
  data: {
    token: string;
  };
}

export type ChatsApiResponse = {
  data: {
    chats: ChatSession[];
  };
};

export type CreateChatApiResponse = {
  data: {
    chat: ChatSession;
  };
};

export type Message = {
  id: string;
  clientId?: string;
  chatSessionId: string;
  role: "USER" | "ASSISTANT";
  content: string;
  createdAt: string;

  optimistic?: boolean;
};

export type PaginatedMessagesResponse = {
  messages: Message[];
  nextCursor: string | null;
  hasMore: boolean;
};

export type ChatMessagesProps = {
  messages: Message[];
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
};
