import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../Auth/loginReducer";
import type { ServerInterviewDetail } from "../../../types/interview.types";

// GET /api/interviews/:id ka data (report page)
interface InterviewDetailState {
  loading: boolean;
  interview: ServerInterviewDetail | null;
  error: string | null;
}

const initialState: InterviewDetailState = {
  loading: false,
  interview: null,
  error: null,
};

const interviewDetailSlice = createSlice({
  name: "interviewDetail",
  initialState,
  reducers: {
    getInterviewRequest: {
      // Naya id aaya to purana interview hata do, warna ek pal ke liye galat data dikhta
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.interview = null;
      },
      prepare: (id: number) => ({ payload: id }),
    },
    getInterviewSuccess: (state, action: PayloadAction<ServerInterviewDetail>) => {
      state.loading = false;
      state.interview = action.payload;
    },
    getInterviewFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { getInterviewRequest, getInterviewSuccess, getInterviewFailure } = interviewDetailSlice.actions;

export default interviewDetailSlice.reducer;
