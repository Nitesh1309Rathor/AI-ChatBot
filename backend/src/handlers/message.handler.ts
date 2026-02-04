import { Router } from "express";
import { ROUTES } from "../routes/routes";
import { requireAuth } from "../middlewares/requireAuth";
import { MessageController } from "../controllers/message.controller";
import { validate } from "../middlewares/zodValidator";
import { getMessagesSchema, sendMessageSchema } from "../validators/message.schema";

const router = Router();
// router.post(ROUTES.MESSAGES.Send, requireAuth, validate(sendMessageSchema), MessageController.sendMessage);
router.get(ROUTES.MESSAGES.GetByChat, requireAuth, validate(getMessagesSchema), MessageController.getMessages);
router.post(ROUTES.MESSAGES.GetAIResponse, requireAuth, validate(sendMessageSchema), MessageController.streamMessageController);

export default router;
