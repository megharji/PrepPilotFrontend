import { call, put, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { signupApi } from "../../api/Auth/signupApi";
import { signupFailure, signupRequest, signupSuccess } from "../../reducers/Auth/signupReducer";
import { loginSuccess } from "../../reducers/Auth/loginReducer";
import { showSnackbar } from "../../reducers/Snackbar/snackbarReducer";
import type { SignupPayload } from "../../../types/auth.types";

function* handleSignup(action: PayloadAction<SignupPayload>): SagaIterator {
  try {
    const response = yield call(signupApi, action.payload);
    yield put(signupSuccess(response.data.user));
    // Register ke saath token mil gaya, seedha login (PublicOnlyRoute dashboard pe bhej dega)
    yield put(loginSuccess(response.data));
    yield put(showSnackbar({ type: "success", message: response.message }));
  } catch (error) {
    const message = (error as Error).message;
    yield put(signupFailure(message));
    yield put(showSnackbar({ type: "error", message }));
  }
}

export default function* signupSaga(): SagaIterator {
  yield takeLatest(signupRequest.type, handleSignup);
}
