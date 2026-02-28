const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // If access token expired → try refresh once
  if (response.status === 401 && endpoint !== "/api/auth/refresh" && endpoint !== "/api/auth/me") {
    const refreshResponse = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (refreshResponse.ok) {
      // Retry original request
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          ...(options.headers || {}),
        },
      });
    } else {
      throw new Error("Unauthorized");
    }
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
