import { apiRequest } from "../apiClient";
import type { ApiResponse, LoginPayload, LoginResponseData } from "../../../types/auth.types";

export const loginApi = (payload: LoginPayload) =>
  apiRequest<ApiResponse<LoginResponseData>>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
