import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SUCCESS } from "../constants/success.messages";

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.register(email, password);
      res.status(201).json({
        message: SUCCESS.USER_REGISTERED,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.status(201).json({
        message: SUCCESS.USER_LOGGED_IN,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },
};
