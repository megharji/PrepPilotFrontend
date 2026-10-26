import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "../storage";

import loginReducer from "./Auth/loginReducer";
import signupReducer from "./Auth/signupReducer";
import interviewReducer from "./Interview/interviewReducer";
import interviewSetupReducer from "./Interview/interviewSetupReducer";
import createInterviewReducer from "./Interview/createInterviewReducer";
import interviewListReducer from "./Interview/interviewListReducer";
import interviewDetailReducer from "./Interview/interviewDetailReducer";
import deleteInterviewReducer from "./Interview/deleteInterviewReducer";
import aiInterviewReducer from "./Interview/aiInterviewReducer";
import profileReducer from "./User/profileReducer";
import resumeReducer from "./Resume/resumeReducer";
import snackbarReducer from "./Snackbar/snackbarReducer";

const rootReducer = combineReducers({
  login: loginReducer,
  signup: signupReducer,
  interviews: interviewReducer,
  interviewSetup: interviewSetupReducer,
  createInterview: createInterviewReducer,
  interviewList: interviewListReducer,
  interviewDetail: interviewDetailReducer,
  deleteInterview: deleteInterviewReducer,
  aiInterview: aiInterviewReducer,
  profile: profileReducer,
  resume: resumeReducer,
  snackbar: snackbarReducer,
});

// login (token + user) persist hota hai taaki refresh ke baad bhi user logged in rahe.
// interviews (local reports) bhi persist, kyunki backend me abhi answers/score save karne ki API nahi hai.
// Interview list/detail backend se aate hain (interviewList, interviewDetail), wo persist nahi hote.
const rootPersistConfig = {
  key: "preppilot",
  storage,
  whitelist: ["login", "interviews"],
};

export type RootState = ReturnType<typeof rootReducer>;

export default persistReducer(rootPersistConfig, rootReducer);
