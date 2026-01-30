import { Router } from "express";
import { ROUTES } from "../routes/routes";
import { requireAuth } from "../middlewares/requireAuth";
import { MessageController } from "../controllers/message.controller";

const router = Router();
router.post(ROUTES.MESSAGES.Send, requireAuth, MessageController.sendMessage);

export default router;
