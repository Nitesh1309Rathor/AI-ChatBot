export const ROUTES = {
  AUTH_ROUTE: {
    Register: "/register",
    Login: "/login",
    Refresh: "/refresh",
    Logout: "/logout",
    Me: "/me",
  },

  CHAT: {
    CreateChat: "/",
    GetAllChats: "/",
  },

  MESSAGES: {
    Send: "/:chatSessionId/messages",
    GetByChat: "/:chatSessionId/messages",
    GetAIResponse: "/:chatSessionId/messages/stream",
  },
};
