import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { prepareQuestionsApi, submitInterviewApi } from "../../api/Interview/aiInterviewApi";
import {
  prepareQuestionsFailure,
  prepareQuestionsRequest,
  prepareQuestionsSuccess,
  submitInterviewFailure,
  submitInterviewRequest,
  submitInterviewSuccess,
} from "../../reducers/Interview/aiInterviewReducer";
import type { SubmitInterviewPayload } from "../../reducers/Interview/aiInterviewReducer";
import { selectAccessToken } from "../../selector";
import { handleApiError } from "../apiError";

function* handlePrepareQuestions(action: PayloadAction<number>): SagaIterator {
  try {
    const token = yield select(selectAccessToken);
    const response = yield call(prepareQuestionsApi, token, action.payload);
    yield put(prepareQuestionsSuccess(response.data));
  } catch (error) {
    // Room "Try again" dikhata hai; snackbar + 401 pe logout common handler se
    yield call(handleApiError, error, prepareQuestionsFailure);
  }
}

function* handleSubmitInterview(action: PayloadAction<SubmitInterviewPayload>): SagaIterator {
  try {
    const token = yield select(selectAccessToken);
    const { id, ...payload } = action.payload;
    const response = yield call(submitInterviewApi, token, id, payload);
    yield put(submitInterviewSuccess(response.data));
  } catch (error) {
    yield call(handleApiError, error, submitInterviewFailure);
  }
}

export default function* aiInterviewSaga(): SagaIterator {
  yield takeLatest(prepareQuestionsRequest.type, handlePrepareQuestions);
  yield takeLatest(submitInterviewRequest.type, handleSubmitInterview);
}
