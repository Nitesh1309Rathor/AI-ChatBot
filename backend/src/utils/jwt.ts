import jwt from "jsonwebtoken";

const secret_key = process.env.JWT_SECRET as string;

if (!secret_key) {
  throw new Error("JWT Scret Key is not Set!");
}

export const signToken = (payload: { userId: string }) => {
  return jwt.sign(payload, secret_key, { expiresIn: "7d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, secret_key) as { userId: string };
};
