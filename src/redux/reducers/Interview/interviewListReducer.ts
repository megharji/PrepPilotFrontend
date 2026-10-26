import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../Auth/loginReducer";
import { createInterviewSuccess } from "./createInterviewReducer";
import { deleteInterviewSuccess } from "./deleteInterviewReducer";
import type { ServerInterview } from "../../../types/interview.types";

// GET /api/interviews ka data (Dashboard + History)
interface InterviewListState {
  loading: boolean;
  // Pehli baar aa gaya? (empty list aur "abhi load nahi hua" me farak ke liye)
  loaded: boolean;
  items: ServerInterview[];
  error: string | null;
}

const initialState: InterviewListState = {
  loading: false,
  loaded: false,
  items: [],
  error: null,
};

const interviewListSlice = createSlice({
  name: "interviewList",
  initialState,
  reducers: {
    getInterviewsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getInterviewsSuccess: (state, action: PayloadAction<ServerInterview[]>) => {
      state.loading = false;
      state.loaded = true;
      state.items = action.payload;
    },
    getInterviewsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Naya interview bana to list me turant sabse upar (refetch ka wait nahi)
      .addCase(createInterviewSuccess, (state, action) => {
        state.items = [action.payload, ...state.items.filter((i) => i.id !== action.payload.id)];
      })
      // Delete hua to list se turant hatao
      .addCase(deleteInterviewSuccess, (state, action) => {
        state.items = state.items.filter((i) => i.id !== action.payload);
      })
      // Logout pe saaf, taaki agle user ko pichhle ka data na dikhe
      .addCase(logout, () => initialState);
  },
});

export const { getInterviewsRequest, getInterviewsSuccess, getInterviewsFailure } =
  interviewListSlice.actions;

export default interviewListSlice.reducer;
