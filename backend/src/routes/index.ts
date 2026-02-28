import { Router } from "express";
import authHandler from "../handlers/auth.handler.js";
import chatHandler from "../handlers/chat.handler.js";
import messageHandler from "../handlers/message.handler.js";

const router = Router();
router.use("/auth", authHandler);
router.use("/chats", chatHandler);
router.use("/chats", messageHandler);

export default router;
