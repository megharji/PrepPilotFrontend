import { call, put, select, takeLatest } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import { profileApi } from "../../api/User/profileApi";
import { profileFailure, profileRequest, profileSuccess } from "../../reducers/User/profileReducer";
import { updateUser } from "../../reducers/Auth/loginReducer";
import { selectAccessToken } from "../../selector";
import { handleApiError } from "../apiError";

function* handleProfile(): SagaIterator {
  try {
    const token = yield select(selectAccessToken);
    const response = yield call(profileApi, token);
    yield put(updateUser(response.data));
    yield put(profileSuccess());
  } catch (error) {
    yield call(handleApiError, error, profileFailure);
  }
}

export default function* profileSaga(): SagaIterator {
  yield takeLatest(profileRequest.type, handleProfile);
}
