import { NextFunction, Request, Response } from "express";
import { MessageService } from "../services/message.service";
import { SUCCESS } from "../constants/success.messages";

export const MessageController = {
  // async sendMessage(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const userId = req.userId!;
  //     const chatSessionId = req.params.chatSessionId as string;
  //     const { content, clientId } = req.body;

  //     const result = await MessageService.sendMessage(userId, chatSessionId, content, clientId);

  //     return res.status(201).json({ message: SUCCESS.MESSAGE_SENT, data: result });
  //   } catch (error) {
  //     next(error);
  //   }
  // },

  async getMessages(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId!;
      const chatSessionId = req.params.chatSessionId as string;
      const { cursor, limit } = req.query;

      const result = await MessageService.getMessages(userId, chatSessionId, Number(limit) || 20, cursor as string | undefined);
      return res.status(200).json({ message: SUCCESS.MESSAGE_FETCHED, data: result });
    } catch (error) {
      next(error);
    }
  },

  async streamMessageController(req: Request, res: Response) {
    const userId = req.userId!;
    const chatSessionId = req.params.chatSessionId as string;
    const { content } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    await MessageService.streamMessageService(userId, chatSessionId, content, res);
  },
};
