import { MessageRole } from "../../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const MessageDao = {
  async createMessage(data: { chatSessionId: string; role: MessageRole; content: string }) {
    return prisma.message.create({ data });
  },

  async findMessagesByChatSessionIdPaginated(chatSessionId: string, limit: number, cursor?: string) {
    return prisma.message.findMany({
      where: { chatSessionId },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      orderBy: { createdAt: "asc" },
    });
  },
};
