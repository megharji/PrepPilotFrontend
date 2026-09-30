import { call, put, select, takeLatest } from "redux-saga/effects";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SagaIterator } from "redux-saga";
import { uploadResumeApi } from "../../api/Resume/uploadResumeApi";
import {
  uploadResumeFailure,
  uploadResumeRequest,
  uploadResumeSuccess,
} from "../../reducers/Resume/resumeReducer";
import { selectAccessToken } from "../../selector";
import { handleApiError } from "../apiError";
import { showSnackbar } from "../../reducers/Snackbar/snackbarReducer";

function* handleUploadResume(action: PayloadAction<File>): SagaIterator {
  try {
    const token = yield select(selectAccessToken);
    const response = yield call(uploadResumeApi, token, action.payload);
    yield put(uploadResumeSuccess(response.data));
    yield put(showSnackbar({ type: "success", message: response.message }));
  } catch (error) {
    yield call(handleApiError, error, uploadResumeFailure);
  }
}

export default function* resumeSaga(): SagaIterator {
  yield takeLatest(uploadResumeRequest.type, handleUploadResume);
}
