import { apiRequest } from "../apiClient";
import type { ApiResponse, LoginResponseData, SignupPayload } from "../../../types/auth.types";

// Register bhi login jaisa { user, token } deta hai
export const signupApi = (payload: SignupPayload) =>
  apiRequest<ApiResponse<LoginResponseData>>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
