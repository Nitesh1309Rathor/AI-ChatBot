import { Request, Response, NextFunction } from "express";
import { ERROR } from "../constants/error.messages";
import logger from "../utils/logger";

export function errorMiddleware(err: Error, _req: Request, res: Response, _next: NextFunction) {
  logger.error(err.message);

  let statusCode = 500;
  let message = ERROR.INTERNAL_SERVER_ERROR;

  if (err.message === ERROR.INVALID_CREDENTIALS) {
    statusCode = 401;
    message = err.message;
  }

  if (err.message === ERROR.USER_EXISTS) {
    statusCode = 409;
    message = err.message;
  }

  res.status(statusCode).json({
    message,
  });
}
