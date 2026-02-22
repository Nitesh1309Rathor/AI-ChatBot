import { LOCAL_STORAGE } from "./auth.storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  // Get the token from local storage.
  const token = LOCAL_STORAGE.getToken();

  // If there is token in LS then attach in header otherwise NO.
  // Login and register have no use of header as there is no token generated till now.
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(options.headers || {}),
    },
  });

  if (response.status === 401 && endpoint !== "/api/auth/login") {
    LOCAL_STORAGE.removeToken();
    window.location.href = "/login";
  }

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
