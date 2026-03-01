import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse({
      body: req.body,
      params: req.params,
      query: req.query,
    });
    next();
  } catch (error: any) {
    return res.status(400).json({
      message: "Validation failed",
      errors: error.errors,
    });
  }
};
