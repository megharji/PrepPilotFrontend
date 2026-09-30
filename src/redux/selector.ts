import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "./reducers";
import type { InterviewRecord } from "../types/interview.types";

export const selectLogin = (state: RootState) => state.login;
export const selectSignup = (state: RootState) => state.signup;

export const selectAccessToken = (state: RootState) => state.login.access_token;
export const selectCurrentUser = (state: RootState) => state.login.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.login.isAuthenticated && !!state.login.access_token;

const NO_INTERVIEWS: InterviewRecord[] = [];

// Logged-in user ke interviews, naye pehle
export const selectMyInterviews = createSelector(
  [(state: RootState) => state.interviews.byUser, selectCurrentUser],
  (byUser, user) => (user ? (byUser[user.id] ?? NO_INTERVIEWS) : NO_INTERVIEWS),
);

export const selectInterviewById = (state: RootState, id: string) =>
  selectMyInterviews(state).find((i) => i.id === id);

export const selectInterviewConfig = (state: RootState) => state.interviewSetup.config;
export const selectResumeUpload = (state: RootState) => state.resume;
export const selectCreateInterview = (state: RootState) => state.createInterview;
export const selectSnackbars = (state: RootState) => state.snackbar.items;
