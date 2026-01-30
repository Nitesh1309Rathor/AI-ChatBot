import { prisma } from "../lib/prisma";

export const MessageDao = {
  async createMessage(data: { chatSessionId: string; role: "USER" | "ASSISTANT"; content: string }) {
    return prisma.message.create({ data });
  },
};
