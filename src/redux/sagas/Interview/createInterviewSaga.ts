import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { createInterviewApi } from "../../api/Interview/createInterviewApi";
import {
  createInterviewFailure,
  createInterviewRequest,
  createInterviewSuccess,
} from "../../reducers/Interview/createInterviewReducer";
import { selectAccessToken } from "../../selector";
import { handleApiError } from "../apiError";
import { showSnackbar } from "../../reducers/Snackbar/snackbarReducer";
import type { CreateInterviewPayload } from "../../../types/interview.types";

function* handleCreateInterview(action: PayloadAction<CreateInterviewPayload>): SagaIterator {
  try {
    const token = yield select(selectAccessToken);
    const response = yield call(createInterviewApi, token, action.payload);
    yield put(createInterviewSuccess(response.data));
    yield put(showSnackbar({ type: "success", message: response.message }));
  } catch (error) {
    yield call(handleApiError, error, createInterviewFailure);
  }
}

export default function* createInterviewSaga(): SagaIterator {
  yield takeLatest(createInterviewRequest.type, handleCreateInterview);
}
