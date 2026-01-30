import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { ROUTES } from "../routes/routes";

const router = Router();

router.post(ROUTES.AUTH_ROUTE.Register, AuthController.register);
router.post(ROUTES.AUTH_ROUTE.Login, AuthController.login);

export default router;
