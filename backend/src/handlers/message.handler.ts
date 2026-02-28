import { Router } from "express";
import { ROUTES } from "../routes/routes.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { MessageController } from "../controllers/message.controller.js";
import { validate } from "../middlewares/zodValidator.js";
import { getMessagesSchema, sendMessageSchema } from "../validators/message.schema.js";

const router = Router();
router.get(ROUTES.MESSAGES.GetByChat, requireAuth, validate(getMessagesSchema), MessageController.getMessages);
router.post(ROUTES.MESSAGES.GetAIResponse, requireAuth, validate(sendMessageSchema), MessageController.streamMessageController);

export default router;
