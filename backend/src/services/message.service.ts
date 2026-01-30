import { ChatDao } from "../repo/chat.repo";
import { MessageDao } from "../repo/message.repo";
import { callAI } from "../utils/callAI";
import logger from "../utils/logger";
import { LOG } from "../constants/log.messages";
import { ERROR } from "../constants/error.messages";
import { MessageRole } from "../../generated/prisma/client";

export const MessageService = {
  async sendMessage(userId: string, chatSessionId: string, content: string) {
    const chatSession = await ChatDao.findChatById(chatSessionId);

    if (!chatSession || chatSession.userId !== userId) {
      logger.warn(`${LOG.CHAT_CREATE_FAILED} userId=${userId} chatId=${chatSessionId}`);
      throw new Error(ERROR.CHAT_NOT_FOUND);
    }

    const message = await MessageDao.createMessage({
      chatSessionId,
      role: MessageRole.USER,
      content,
    });

    logger.info(`${LOG.MESSAGE_USER_SAVED} userId=${userId} chatId=${chatSessionId}`);

    logger.info(`${LOG.AI_REQUEST_STARTED} userId=${userId} chatId=${chatSessionId}`);

    let aiResponse: string;
    try {
      aiResponse = await callAI(content);
    } catch (err) {
      logger.error(`${LOG.AI_RESPONSE_FAILED} userId=${userId} chatId=${chatSessionId}`, { error: (err as Error).message });
      throw new Error(ERROR.AI_FAILED);
    }

    const aiMessage = await MessageDao.createMessage({
      chatSessionId,
      role: MessageRole.ASSISTANT,
      content: aiResponse,
    });

    logger.info(`${LOG.AI_RESPONSE_SAVED} userId=${userId} chatId=${chatSessionId}`);

    return { message, aiMessage };
  },
};
