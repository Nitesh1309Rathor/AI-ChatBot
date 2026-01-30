export const ROUTES = {
  AUTH_ROUTE: {
    Register: "/register",
    Login: "/login",
  },

  CHAT: {
    CreateChat: "/",
    GetAllChats: "/",
  },

  MESSAGES: {
    Send: "/:chatSessionId/message",
  },
};
