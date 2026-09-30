import { all, fork } from "redux-saga/effects";
import type { SagaIterator } from "redux-saga";
import loginSaga from "./Auth/loginSaga";
import signupSaga from "./Auth/signupSaga";
import profileSaga from "./User/profileSaga";
import resumeSaga from "./Resume/resumeSaga";
import createInterviewSaga from "./Interview/createInterviewSaga";

export default function* rootSaga(): SagaIterator {
  yield all([
    fork(loginSaga),
    fork(signupSaga),
    fork(profileSaga),
    fork(resumeSaga),
    fork(createInterviewSaga),
  ]);
}
