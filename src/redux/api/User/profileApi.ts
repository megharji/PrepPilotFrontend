import { apiRequest } from "../apiClient";
import type { ApiResponse, User } from "../../../types/auth.types";

// GET /api/users/profile (token zaroori)
export const profileApi = (token: string | null) =>
  apiRequest<ApiResponse<User>>("/api/users/profile", { method: "GET", token });
