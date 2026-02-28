import { NextFunction, Request, Response } from "express";
import { ChatService } from "../services/chat.service.js";
import { SUCCESS } from "../constants/success.messages.js";

export const ChatController = {
  async createChat(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const chat = await ChatService.createChat(userId);

      return res.status(201).json({
        message: SUCCESS.CHAT_CREATED,
        data: { chat },
      });
    } catch (error) {
      next(error);
    }
  },

  async getAllChat(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const chats = await ChatService.getAllChats(userId);

      return res.status(200).json({
        message: SUCCESS.CHAT_FETCHED,
        data: {
          chats,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
