import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { getInterviewApi } from "../../api/Interview/getInterviewApi";
import {
  getInterviewFailure,
  getInterviewRequest,
  getInterviewSuccess,
} from "../../reducers/Interview/interviewDetailReducer";
import { selectAccessToken } from "../../selector";
import { handleApiError } from "../apiError";

function* handleGetInterview(action: PayloadAction<number>): SagaIterator {
  try {
    const token = yield select(selectAccessToken);
    const response = yield call(getInterviewApi, token, action.payload);
    yield put(getInterviewSuccess(response.data));
  } catch (error) {
    yield call(handleApiError, error, getInterviewFailure);
  }
}

export default function* interviewDetailSaga(): SagaIterator {
  yield takeLatest(getInterviewRequest.type, handleGetInterview);
}
