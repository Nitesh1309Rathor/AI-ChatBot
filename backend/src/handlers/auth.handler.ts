import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { ROUTES } from "../routes/routes";
import { validate } from "../middlewares/zodValidator";
import { loginSchema, registerSchema } from "../validators/auth.schema";

const router = Router();

router.post(ROUTES.AUTH_ROUTE.Register, validate(registerSchema), AuthController.register);
router.post(ROUTES.AUTH_ROUTE.Login, validate(loginSchema), AuthController.login);

export default router;
