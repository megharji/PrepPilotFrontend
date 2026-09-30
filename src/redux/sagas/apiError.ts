import { put } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { ApiRequestError } from "../api/apiClient";
import { logout } from "../reducers/Auth/loginReducer";
import { showSnackbar } from "../reducers/Snackbar/snackbarReducer";

// Protected APIs ka common error handling:
// backend ka message snackbar me, failure action me bhi; 401 (token expire/galat) -> logout
export function* handleApiError(
  error: unknown,
  failure: (message: string) => PayloadAction<string>,
): SagaIterator {
  const message = error instanceof Error ? error.message : "Something went wrong";
  yield put(failure(message));
  yield put(showSnackbar({ type: "error", message }));

  if (error instanceof ApiRequestError && error.status === 401) {
    yield put(logout());
  }
}
