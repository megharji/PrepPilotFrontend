import { all, fork } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import loginSaga from "./Auth/loginSaga";
import signupSaga from "./Auth/signupSaga";
import profileSaga from "./User/profileSaga";
import resumeSaga from "./Resume/resumeSaga";
import createInterviewSaga from "./Interview/createInterviewSaga";
import interviewListSaga from "./Interview/interviewListSaga";
import interviewDetailSaga from "./Interview/interviewDetailSaga";
import aiInterviewSaga from "./Interview/aiInterviewSaga";
import deleteInterviewSaga from "./Interview/deleteInterviewSaga";

export default function* rootSaga(): SagaIterator {
  yield all([
    fork(loginSaga),
    fork(signupSaga),
    fork(profileSaga),
    fork(resumeSaga),
    fork(createInterviewSaga),
    fork(interviewListSaga),
    fork(interviewDetailSaga),
    fork(aiInterviewSaga),
    fork(deleteInterviewSaga),
  ]);
}
