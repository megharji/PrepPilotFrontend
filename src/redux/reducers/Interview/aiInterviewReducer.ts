import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../Auth/loginReducer";
import type { DemoQuestion } from "../../../data/demoInterview";
import type { ServerInterviewDetail, SubmittedAnswer } from "../../../types/interview.types";

// Interview room ka AI wala hissa: sawaal banana (prepare) aur jawab check karwana (submit)
interface AiInterviewState {
  // Kis interview ke sawaal hain (doosre interview ke sawaal galti se na dikhen)
  interviewId: number | null;
  preparing: boolean;
  questions: DemoQuestion[] | null;
  // AI se sawaal nahi bane (key nahi / limit / error): room "Try again" dikhata hai
  prepareError: string | null;
  submitting: boolean;
  result: ServerInterviewDetail | null;
  submitError: string | null;
}

const initialState: AiInterviewState = {
  interviewId: null,
  preparing: false,
  questions: null,
  prepareError: null,
  submitting: false,
  result: null,
  submitError: null,
};

export interface SubmitInterviewPayload {
  id: number;
  answers: SubmittedAnswer[];
  durationSec: number;
}

const aiInterviewSlice = createSlice({
  name: "aiInterview",
  initialState,
  reducers: {
    prepareQuestionsRequest: {
      // Naye interview ke liye sab saaf karke shuru
      reducer: (_state, action: PayloadAction<number>) => ({
        ...initialState,
        interviewId: action.payload,
        preparing: true,
      }),
      prepare: (id: number) => ({ payload: id }),
    },
    prepareQuestionsSuccess: (state, action: PayloadAction<DemoQuestion[]>) => {
      state.preparing = false;
      state.questions = action.payload;
    },
    prepareQuestionsFailure: (state, action: PayloadAction<string>) => {
      state.preparing = false;
      state.prepareError = action.payload;
    },
    submitInterviewRequest: {
      reducer: (state) => {
        state.submitting = true;
        state.submitError = null;
      },
      prepare: (payload: SubmitInterviewPayload) => ({ payload }),
    },
    submitInterviewSuccess: (state, action: PayloadAction<ServerInterviewDetail>) => {
      state.submitting = false;
      state.result = action.payload;
    },
    submitInterviewFailure: (state, action: PayloadAction<string>) => {
      state.submitting = false;
      state.submitError = action.payload;
    },
    resetAiInterview: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const {
  prepareQuestionsRequest,
  prepareQuestionsSuccess,
  prepareQuestionsFailure,
  submitInterviewRequest,
  submitInterviewSuccess,
  submitInterviewFailure,
  resetAiInterview,
} = aiInterviewSlice.actions;

export default aiInterviewSlice.reducer;
