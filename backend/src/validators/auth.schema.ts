import z from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  pasword: z.string().min(8),
});

export const loginSchema = z.object({
  email: z.string().email(),
  pasword: z.string(),
});
