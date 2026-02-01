import { ChatDao } from "../repo/chat.repo";
import { MessageDao } from "../repo/message.repo";
import { callAI } from "../utils/callAI";
import logger from "../utils/logger";
import { LOG } from "../constants/log.messages";
import { ERROR } from "../constants/error.messages";
import { MessageRole } from "../../generated/prisma/client";

export const MessageService = {
  async sendMessage(userId: string, chatSessionId: string, content: string, clientId: string) {
    const chatSession = await ChatDao.findChatById(chatSessionId);

    if (!chatSession || chatSession.userId !== userId) {
      logger.warn(`${LOG.CHAT_CREATE_FAILED} userId=${userId} chatId=${chatSessionId}`);
      throw new Error(ERROR.CHAT_NOT_FOUND);
    }

    // User Message storing in Message table.
    const message = await MessageDao.createMessage({
      chatSessionId,
      role: MessageRole.USER,
      content,
      clientId,
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

    // AI response Message storing in Message table.
    const aiMessage = await MessageDao.createMessage({
      chatSessionId,
      role: MessageRole.ASSISTANT,
      content: aiResponse,
    });

    logger.info(`${LOG.AI_RESPONSE_SAVED} userId=${userId} chatId=${chatSessionId}`);

    return { userMessage: message, aiMessage };
  },

  async getMessages(userId: string, chatSessionId: string, limit = 20, cursor?: string) {
    const chatSession = await ChatDao.findChatById(chatSessionId);

    if (!chatSession) {
      logger.warn(`${ERROR.CHAT_NOT_FOUND} chatId=${chatSessionId}`);
      throw new Error(ERROR.CHAT_NOT_FOUND);
    }

    if (chatSession.userId !== userId) {
      logger.warn(`${ERROR.UNAUTHORIZED} userId=${userId} chatId=${chatSessionId}`);
      throw new Error(ERROR.UNAUTHORIZED);
    }

    const messages = await MessageDao.findMessagesByChatSessionIdPaginated(chatSessionId, limit, cursor);

    const hasMore = messages.length > limit;
    const slicedMessages = hasMore ? messages.slice(0, limit) : messages;

    const nextCursor = hasMore ? slicedMessages[slicedMessages.length - 1].id : null;

    logger.info(`${LOG.MESSAGES_FETCH_SUCCESS} userId=${userId} chatId=${chatSessionId} count=${slicedMessages.length}`);

    return {
      messages: slicedMessages,
      nextCursor,
      hasMore,
    };
  },
};
