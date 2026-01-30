import { NextFunction, Request, Response } from "express";
import { MessageService } from "../services/message.service";
import { SUCCESS } from "../constants/success.messages";

export const MessageController = {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const chatSessionId = req.params.chatSessionId as string;
      const { content } = req.body;

      const result = await MessageService.sendMessage(userId, chatSessionId, content);

      return res.status(201).json({ message: SUCCESS.MESSAGE_SENT, data: result });
    } catch (error) {
      next(error);
    }
  },

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const chatSessionId = req.params.chatSessionId as string;
      const { cursor, limit } = req.query;

      const messages = await MessageService.getMessages(userId, chatSessionId, Number(limit) || 20, cursor as string | undefined);
      return res.status(200).json({ message: SUCCESS.MESSAGE_FETCHED, data: { messages } });
    } catch (error) {
      next(error);
    }
  },
};
