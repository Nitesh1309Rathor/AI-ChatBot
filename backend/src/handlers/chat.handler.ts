import { Router } from "express";
import { ROUTES } from "../routes/routes.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { ChatController } from "../controllers/chat.controller.js";

const router = Router();
router.post(ROUTES.CHAT.CreateChat, requireAuth, ChatController.createChat);
router.get(ROUTES.CHAT.GetAllChats, requireAuth, ChatController.getAllChat);

export default router;
