import { apiRequest } from "../apiClient";
import type { ApiResponse } from "../../../types/auth.types";
import type { ServerResume } from "../../../types/interview.types";

// POST /api/resumes, multipart form-data, field name "resume" (token zaroori)
export const uploadResumeApi = (token: string | null, file: File) => {
  const body = new FormData();
  body.append("resume", file);

  return apiRequest<ApiResponse<ServerResume>>("/api/resumes", { method: "POST", body, token });
};
