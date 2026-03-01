import { ChatDao } from "../repo/chat.repo.js";
import { MessageDao } from "../repo/message.repo.js";
import logger from "../utils/logger.js";
import { LOG } from "../constants/log.messages.js";
import { ERROR } from "../constants/error.messages.js";
import type { Response } from "express";
import { streamAIResponse } from "../utils/ai.js";

export const MessageService = {
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

    let nextCursor: string | null = null;

    if (hasMore && slicedMessages.length > 0) {
      const lastMessage = slicedMessages[slicedMessages.length - 1];
      nextCursor = lastMessage.id;
    }

    logger.info(`${LOG.MESSAGES_FETCH_SUCCESS} userId=${userId} chatId=${chatSessionId} count=${slicedMessages.length}`);

    return {
      messages: slicedMessages,
      nextCursor,
      hasMore,
    };
  },

  async streamMessageService(userId: string, chatSessionId: string, content: string, res: Response) {
    logger.info("AI response generation started", {
      category: "MESSAGE",
      chatSessionId,
    });

    // Ownership check
    const chat = await ChatDao.findChatById(chatSessionId);
    if (!chat || chat.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Save user message
    const userMessage = await MessageDao.createMessage({
      chatSessionId,
      role: "USER",
      content,
    });

    let title: string | null = null;
    if (!chat.title) {
      title = content.length > 40 ? content.slice(0, 40).trim() + "..." : content;
      await ChatDao.updateChatTitle(chatSessionId, title);
    }

    // Send metadata
    res.write(`event: meta\ndata: ${JSON.stringify({ userMessage, chatTitle: chat.title ?? title })}\n\n`);

    // Store the AI response.
    let fullAIResponse = "";

    // Stream Gemini tokens
    try {
      logger.info("Calling Gemini stream", {
        category: "MESSAGE",
        prompt: content,
      });

      await streamAIResponse(content, {
        // Token By Token add in AI response.
        onToken(token) {
          fullAIResponse += token;
          res.write(`data: ${token}\n\n`);
        },

        // OnComplete Save the AI response in DB.
        async onComplete() {
          const aiMessage = await MessageDao.createMessage({
            chatSessionId,
            role: "ASSISTANT",
            content: fullAIResponse,
          });

          res.write(`event: done\ndata: ${JSON.stringify({ aiMessage })}\n\n`);
          res.end();
        },
      });
    } catch (err) {
      logger.error("AI response generation failed", {
        category: "MESSAGE",
        err,
      });

      res.write(`event: error\ndata: AI streaming failed\n\n`);
      res.end();
    }
  },
};
