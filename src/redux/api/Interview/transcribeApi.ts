import { apiRequest } from "../apiClient";
import type { ApiResponse } from "../../../types/auth.types";

// POST /api/interviews/:id/transcribe, multipart field "audio" (token zaroori).
// Voice answer -> text (Groq Whisper); text sirf AI scoring ke liye.
export const transcribeApi = (token: string | null, interviewId: number, audio: Blob, filename: string) => {
  const body = new FormData();
  body.append("audio", audio, filename);

  return apiRequest<ApiResponse<{ text: string }>>(`/api/interviews/${interviewId}/transcribe`, {
    method: "POST",
    body,
    token,
  });
};
