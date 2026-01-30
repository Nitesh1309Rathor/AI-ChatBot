import { LOCAL_STORAGE } from "./auth.storage";
import { decodeJwt } from "./jwt";

export function isAuthenticated(): boolean {
  const token = LOCAL_STORAGE.getToken();
  if (!token) return false;

  const payload = decodeJwt(token);
  if (!payload?.exp) return false;

  const isExpired = Date.now() >= payload.exp * 1000;

  return !isExpired;
}
