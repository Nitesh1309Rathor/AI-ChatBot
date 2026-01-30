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
  data: ChatSession;
};
