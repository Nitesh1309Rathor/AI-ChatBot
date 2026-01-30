import { Router } from "express";
import authHandler from "../handlers/auth.handler";
import chatHandler from "../handlers/chat.handler";
import messageHandler from "../handlers/message.handler";

const router = Router();
router.use("/auth", authHandler);
router.use("/chats", chatHandler);
router.use("/chats", messageHandler);

export default router;
