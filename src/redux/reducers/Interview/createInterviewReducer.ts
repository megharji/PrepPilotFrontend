import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../Auth/loginReducer";
import type { CreateInterviewPayload, ServerInterview } from "../../../types/interview.types";

interface CreateInterviewState {
  loading: boolean;
  interview: ServerInterview | null;
  error: string | null;
}

const initialState: CreateInterviewState = {
  loading: false,
  interview: null,
  error: null,
};

const createInterviewSlice = createSlice({
  name: "createInterview",
  initialState,
  reducers: {
    // payload saga ke liye hai, reducer me use nahi hota
    createInterviewRequest: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.interview = null;
      },
      prepare: (payload: CreateInterviewPayload) => ({ payload }),
    },
    createInterviewSuccess: (state, action: PayloadAction<ServerInterview>) => {
      state.loading = false;
      state.interview = action.payload;
    },
    createInterviewFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetCreateInterview: () => initialState,
  },
  // Logout pe saaf, taaki agle user ko pichhle ka data na dikhe
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  createInterviewRequest,
  createInterviewSuccess,
  createInterviewFailure,
  resetCreateInterview,
} = createInterviewSlice.actions;

export default createInterviewSlice.reducer;
