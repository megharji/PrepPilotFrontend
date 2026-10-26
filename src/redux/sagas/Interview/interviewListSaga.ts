import { call, put, select, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { getInterviewsApi } from "../../api/Interview/getInterviewsApi";
import {
  getInterviewsFailure,
  getInterviewsRequest,
  getInterviewsSuccess,
} from "../../reducers/Interview/interviewListReducer";
import { selectAccessToken } from "../../selector";
import { handleApiError } from "../apiError";

// Success pe snackbar nahi (har page khulne pe "fetched" dikhana irritating hai); error pe dikhta hai
function* handleGetInterviews(): SagaIterator {
  try {
    const token = yield select(selectAccessToken);
    const response = yield call(getInterviewsApi, token);
    yield put(getInterviewsSuccess(response.data));
  } catch (error) {
    yield call(handleApiError, error, getInterviewsFailure);
  }
}

export default function* interviewListSaga(): SagaIterator {
  yield takeLatest(getInterviewsRequest.type, handleGetInterviews);
}
