import jwt from "jsonwebtoken";

const access_secret_key = process.env.JWT_ACCESS_SECRET as string;
const refresh_secret_key = process.env.JWT_REFRESH_SECRET as string;

if (!access_secret_key) {
  throw new Error("JWT Scret Key is not Set!");
}

export const signAccessToken = (payload: { userId: string }) => {
  return jwt.sign(payload, access_secret_key, { expiresIn: "15m" });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, access_secret_key) as { userId: string };
};

export const signRefreshToken = (payload: { userId: string }) => {
  return jwt.sign(payload, refresh_secret_key, { expiresIn: "7d" });
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, refresh_secret_key) as { userId: string };
};
