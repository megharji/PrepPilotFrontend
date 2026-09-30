import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { InterviewRecord } from "../../../types/interview.types";

// Har user ke interviews alag, taaki ek browser me do log login karein to mix na ho
interface InterviewState {
  byUser: Record<number, InterviewRecord[]>;
}

const initialState: InterviewState = {
  byUser: {},
};

const interviewSlice = createSlice({
  name: "interviews",
  initialState,
  reducers: {
    saveInterview: (state, action: PayloadAction<{ userId: number; record: InterviewRecord }>) => {
      const { userId, record } = action.payload;
      // Naya sabse upar
      state.byUser[userId] = [record, ...(state.byUser[userId] ?? [])];
    },
  },
});

export const { saveInterview } = interviewSlice.actions;

export default interviewSlice.reducer;
