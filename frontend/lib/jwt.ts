interface JwtPayload {
  exp?: number;
  [key: string]: any;
}

export function decodeJwt(token: string): JwtPayload | null {
  try {
    const payload = token.split(".")[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}
