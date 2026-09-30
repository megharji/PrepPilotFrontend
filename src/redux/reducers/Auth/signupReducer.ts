import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SignupPayload, User } from "../../../types/auth.types";

interface SignupState {
  loading: boolean;
  user: User | null;
  error: string | null;
  success: boolean;
}

const initialState: SignupState = {
  loading: false,
  user: null,
  error: null,
  success: false,
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    // payload saga ke liye hai, reducer me use nahi hota
    signupRequest: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      },
      prepare: (payload: SignupPayload) => ({ payload }),
    },
    signupSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.success = true;
    },
    signupFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.success = false;
    },
    resetSignupState: () => initialState,
  },
});

export const { signupRequest, signupSuccess, signupFailure, resetSignupState } = signupSlice.actions;

export default signupSlice.reducer;
