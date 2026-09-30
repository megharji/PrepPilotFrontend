import { call, delay, put, race, select, take, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { REHYDRATE } from "redux-persist";
import { loginApi } from "../../api/Auth/loginApi";
import { loginFailure, loginRequest, loginSuccess, logout } from "../../reducers/Auth/loginReducer";
import { selectAccessToken } from "../../selector";
import { showSnackbar } from "../../reducers/Snackbar/snackbarReducer";
import { getTokenExpiry } from "../../../utils/jwt";
import type { LoginPayload } from "../../../types/auth.types";

function* handleLogin(action: PayloadAction<LoginPayload>): SagaIterator {
  try {
    const response = yield call(loginApi, action.payload);
    yield put(loginSuccess(response.data));
    yield put(showSnackbar({ type: "success", message: response.message }));
  } catch (error) {
    const message = (error as Error).message;
    yield put(loginFailure(message));
    yield put(showSnackbar({ type: "error", message }));
  }
}

// Token expire hote hi logout. Pehle hi logout ho gaya ya dobara login hua to timer cancel.
function* autoLogout(): SagaIterator {
  const token: string | null = yield select(selectAccessToken);
  if (!token) return;

  const expiry = getTokenExpiry(token);
  if (!expiry) return;

  const remaining = expiry - Date.now();
  if (remaining <= 0) {
    yield put(logout());
    yield put(showSnackbar({ type: "info", message: "Your session has expired. Please log in again." }));
    return;
  }

  const { expired } = yield race({
    expired: delay(remaining),
    cancelled: take([logout.type, loginRequest.type]),
  });

  if (expired) {
    yield put(logout());
    yield put(showSnackbar({ type: "info", message: "Your session has expired. Please log in again." }));
  }
}

export default function* loginSaga(): SagaIterator {
  yield takeLatest(loginRequest.type, handleLogin);
  // Login pe aur page refresh (persist rehydrate) pe dono jagah timer start
  yield takeLatest([loginSuccess.type, REHYDRATE], autoLogout);
}
