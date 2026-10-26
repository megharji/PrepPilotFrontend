import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { InterviewRecord } from "../../../types/interview.types";
import { deleteInterviewSuccess } from "./deleteInterviewReducer";

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
  extraReducers: (builder) => {
    // Server pe interview delete hua to is browser me saved uski report bhi hatao
    builder.addCase(deleteInterviewSuccess, (state, action) => {
      Object.keys(state.byUser).forEach((key) => {
        const userId = Number(key);
        state.byUser[userId] = state.byUser[userId].filter((r) => r.serverId !== action.payload);
      });
    });
  },
});

export const { saveInterview } = interviewSlice.actions;

export default interviewSlice.reducer;
