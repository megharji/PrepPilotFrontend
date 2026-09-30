import { combineReducers } from "@reduxjs/toolkit";
import { persistReducer } from "redux-persist";
import storage from "../storage";

import loginReducer from "./Auth/loginReducer";
import signupReducer from "./Auth/signupReducer";
import interviewReducer from "./Interview/interviewReducer";
import interviewSetupReducer from "./Interview/interviewSetupReducer";
import createInterviewReducer from "./Interview/createInterviewReducer";
import profileReducer from "./User/profileReducer";
import resumeReducer from "./Resume/resumeReducer";
import snackbarReducer from "./Snackbar/snackbarReducer";

const rootReducer = combineReducers({
  login: loginReducer,
  signup: signupReducer,
  interviews: interviewReducer,
  interviewSetup: interviewSetupReducer,
  createInterview: createInterviewReducer,
  profile: profileReducer,
  resume: resumeReducer,
  snackbar: snackbarReducer,
});

// login (token + user) persist hota hai taaki refresh ke baad bhi user logged in rahe.
// interviews (reports) bhi persist, kyunki backend me abhi report save/list API nahi hai.
const rootPersistConfig = {
  key: "preppilot",
  storage,
  whitelist: ["login", "interviews"],
};

export type RootState = ReturnType<typeof rootReducer>;

export default persistReducer(rootPersistConfig, rootReducer);
