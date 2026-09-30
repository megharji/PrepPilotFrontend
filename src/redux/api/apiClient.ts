const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

// Backend ka status code bhi saath rakhte hain, taaki saga 401 pe logout kar sake
export class ApiRequestError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions extends RequestInit {
  // Protected routes ke liye: "Authorization: Bearer <token>"
  token?: string | null;
}

// Saare API calls isi se jaate hain, taaki headers aur error handling ek jagah rahe
export const apiRequest = async <T>(path: string, { token, ...options }: RequestOptions = {}): Promise<T> => {
  const isFormData = options.body instanceof FormData;

  let response: Response;
  try {
    response = await fetch(API_BASE_URL + path, {
      ...options,
      headers: {
        Accept: "application/json",
        // FormData ke saath Content-Type browser khud set karta hai (boundary ke saath)
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiRequestError(0, "Server se connect nahi ho paya. Backend chal raha hai?");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiRequestError(response.status, data.message || "Something went wrong");
  }

  return data as T;
};
