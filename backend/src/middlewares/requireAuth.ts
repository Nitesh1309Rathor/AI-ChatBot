import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
import { LOG } from "../constants/log.messages.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn(LOG.AUTH_MISSING_TOKEN);
    throw new Error("Unauthorized");
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    throw new Error("Unauthorized");
  }

  const payload = verifyToken(token);

  req.userId = payload.userId;

  next();
}
