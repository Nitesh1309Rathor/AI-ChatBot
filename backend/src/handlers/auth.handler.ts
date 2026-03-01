import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { ROUTES } from "../routes/routes.js";
import { validate } from "../middlewares/zodValidator.js";
import { loginSchema, registerSchema } from "../validators/auth.schema.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

router.post(ROUTES.AUTH_ROUTE.Register, validate(registerSchema), AuthController.register);
router.post(ROUTES.AUTH_ROUTE.Login, validate(loginSchema), AuthController.login);
router.post(ROUTES.AUTH_ROUTE.Refresh, AuthController.refresh);
router.post(ROUTES.AUTH_ROUTE.Logout, requireAuth, AuthController.logout);
router.get(ROUTES.AUTH_ROUTE.Me, requireAuth, AuthController.check);
export default router;
