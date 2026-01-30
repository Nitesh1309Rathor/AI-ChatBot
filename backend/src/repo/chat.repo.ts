import { prisma } from "../lib/prisma";

export const ChatDao = {
  async createChat(userId: string) {
    return prisma.chatSession.create({
      data: { userId },
    });
  },

  async findChatsByUser(userId: string) {
    return prisma.chatSession.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  },

  async findChatById(chatSessionId: string) {
    return prisma.chatSession.findUnique({ where: { id: chatSessionId } });
  },
};
