import { ChatDao } from "../repo/chat.repo";
import logger from "../utils/logger";
import { LOG } from "../constants/log.messages";

export const ChatService = {
  async createChat(userId: string) {
    logger.info(`${LOG.CHAT_CREATE_START} userId=${userId}`);

    const chat = await ChatDao.createChat(userId);

    logger.info(`${LOG.CHAT_CREATE_SUCCESS} userId=${userId} chatId=${chat.id}`);

    return chat;
  },

  async getAllChats(userId: string) {
    const chats = await ChatDao.findChatsByUser(userId);

    logger.info(`${LOG.CHAT_FETCH_SUCCESS} userId=${userId} count=${chats.length}`);

    return chats;
  },
};
