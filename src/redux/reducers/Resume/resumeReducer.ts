import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../Auth/loginReducer";
import type { ServerResume } from "../../../types/interview.types";

interface ResumeState {
  loading: boolean;
  resume: ServerResume | null;
  error: string | null;
}

const initialState: ResumeState = {
  loading: false,
  resume: null,
  error: null,
};

const resumeSlice = createSlice({
  name: "resume",
  initialState,
  reducers: {
    // File (non-serializable) sirf saga tak jaati hai, state me nahi rakhte
    uploadResumeRequest: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
      },
      prepare: (file: File) => ({ payload: file }),
    },
    uploadResumeSuccess: (state, action: PayloadAction<ServerResume>) => {
      state.loading = false;
      state.resume = action.payload;
    },
    uploadResumeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Is interview ke liye resume hatao (server se delete ki API abhi nahi hai)
    clearResume: () => initialState,
  },
  // Logout pe saaf, taaki agle user ko pichhle ka data na dikhe
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { uploadResumeRequest, uploadResumeSuccess, uploadResumeFailure, clearResume } =
  resumeSlice.actions;

export default resumeSlice.reducer;
