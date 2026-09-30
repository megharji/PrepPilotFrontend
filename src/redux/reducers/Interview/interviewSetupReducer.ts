import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../Auth/loginReducer";
import type { InterviewConfig } from "../../../types/interview.types";

// Setup wizard se interview room tak config pahunchane ke liye.
// Persist nahi hota: refresh pe user wapas setup pe jaata hai.
interface InterviewSetupState {
  config: InterviewConfig | null;
}

const initialState: InterviewSetupState = {
  config: null,
};

const interviewSetupSlice = createSlice({
  name: "interviewSetup",
  initialState,
  reducers: {
    setInterviewConfig: (state, action: PayloadAction<InterviewConfig>) => {
      state.config = action.payload;
    },
  },
  // Logout pe saaf, taaki agle user ko pichhle ka data na dikhe
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { setInterviewConfig } = interviewSetupSlice.actions;

export default interviewSetupSlice.reducer;
