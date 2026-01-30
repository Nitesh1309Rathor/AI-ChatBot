import { LOCAL_STORAGE } from "./auth.storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = LOCAL_STORAGE.getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let message = "Something went wrong";
    const contentType = response.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const errorData = await response.json();
      message = errorData.message || message;
    }

    throw new Error(message);
  }

  return response.json();
}
