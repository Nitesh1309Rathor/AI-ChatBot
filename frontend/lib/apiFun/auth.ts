import { AuthResponse, LoginApiResponse } from "@/constants/types";
import { apiFetch } from "@/lib/api";

export async function login(email: string, password: string) {
  return apiFetch<LoginApiResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string) {
  return apiFetch<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}
