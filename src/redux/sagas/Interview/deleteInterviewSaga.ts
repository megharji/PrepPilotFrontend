import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { deleteInterviewApi } from "../../api/Interview/deleteInterviewApi";
import {
  deleteInterviewFailure,
  deleteInterviewRequest,
  deleteInterviewSuccess,
} from "../../reducers/Interview/deleteInterviewReducer";
import { showSnackbar } from "../../reducers/Snackbar/snackbarReducer";
import { selectAccessToken } from "../../selector";
import { handleApiError } from "../apiError";

function* handleDeleteInterview(action: PayloadAction<number>): SagaIterator {
  try {
    const token = yield select(selectAccessToken);
    const response = yield call(deleteInterviewApi, token, action.payload);
    yield put(deleteInterviewSuccess(action.payload));
    yield put(showSnackbar({ type: "success", message: response.message }));
  } catch (error) {
    yield call(handleApiError, error, deleteInterviewFailure);
  }
}

export default function* deleteInterviewSaga(): SagaIterator {
  yield takeLatest(deleteInterviewRequest.type, handleDeleteInterview);
}
