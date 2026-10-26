import { apiRequest } from "../apiClient";
import type { ApiResponse } from "../../../types/auth.types";

// DELETE /api/interviews/:id: sirf apna interview (kisi aur ka ho to 404), token zaroori
export const deleteInterviewApi = (token: string | null, id: number) =>
  apiRequest<ApiResponse<{ id: number }>>(`/api/interviews/${id}`, { method: "DELETE", token });
