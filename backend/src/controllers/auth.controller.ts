import { NextFunction, Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { SUCCESS } from "../constants/success.messages";

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const { accessToken, refreshToken } = await AuthService.register(name, email, password);

      // Set the tokens in cookie.
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      // Return only accessToken.
      res.status(201).json({
        message: SUCCESS.USER_REGISTERED,
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await AuthService.login(email, password);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 15 * 60 * 1000,
      });

      res.status(201).json({
        message: SUCCESS.USER_LOGGED_IN,
      });
    } catch (error) {
      next(error);
    }
  },

  // When accessToken expires then refreshes token request.
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) return res.sendStatus(401);

      const { accessToken } = await AuthService.refresh(refreshToken);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: false,
        maxAge: 15 * 60 * 1000,
        path: "/",
      });

      res.status(200).json({ message: "Token refreshed" });
    } catch (err) {
      next(err);
    }
  },

  async logout(req: any, res: Response, next: NextFunction) {
    try {
      await AuthService.logout(req.userId);

      res.clearCookie("accessToken", { path: "/" });
      res.clearCookie("refreshToken", { path: "/" });

      res.status(200).json({ message: "Logged out" });
    } catch (err) {
      next(err);
    }
  },

  // controller
  async check(req: any, res: Response) {
    res.status(200).json({ ok: true });
  },
};
