import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { LoginPayload, LoginResponseData, User } from "../../../types/auth.types";

interface LoginState {
  isAuthenticated: boolean;
  access_token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

const initialState: LoginState = {
  isAuthenticated: false,
  access_token: null,
  user: null,
  loading: false,
  error: null,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    // payload saga ke liye hai, reducer me use nahi hota
    loginRequest: {
      reducer: (state) => {
        state.loading = true;
        state.error = null;
      },
      prepare: (payload: LoginPayload) => ({ payload }),
    },
    loginSuccess: (state, action: PayloadAction<LoginResponseData>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.access_token = action.payload.token;
      state.user = action.payload.user;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.isAuthenticated = false;
      state.access_token = null;
      state.user = null;
      state.error = action.payload;
    },
    resetLoginState: (state) => {
      state.loading = false;
      state.error = null;
    },
    // Profile API se aaya taaza user (naam/email badle hon to header me dikhe)
    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: () => initialState,
  },
});

export const { loginRequest, loginSuccess, loginFailure, resetLoginState, updateUser, logout } =
  loginSlice.actions;

export default loginSlice.reducer;
