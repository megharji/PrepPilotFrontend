import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

// User khud login slice me rehta hai (persist hota hai), yahan sirf API call ki state
interface ProfileState {
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    profileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    profileSuccess: (state) => {
      state.loading = false;
    },
    profileFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { profileRequest, profileSuccess, profileFailure } = profileSlice.actions;

export default profileSlice.reducer;
