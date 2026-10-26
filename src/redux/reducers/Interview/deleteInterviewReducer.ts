import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { logout } from "../Auth/loginReducer";

// DELETE /api/interviews/:id ki state. List/local report se hatana unke apne slices karte hain.
interface DeleteInterviewState {
  // Abhi kaunsa delete ho raha hai (us row/button pe spinner)
  deletingId: number | null;
  // Aakhri delete hua (report page isse History pe wapas jaata hai)
  lastDeletedId: number | null;
  error: string | null;
}

const initialState: DeleteInterviewState = {
  deletingId: null,
  lastDeletedId: null,
  error: null,
};

const deleteInterviewSlice = createSlice({
  name: "deleteInterview",
  initialState,
  reducers: {
    deleteInterviewRequest: {
      reducer: (state, action: PayloadAction<number>) => {
        state.deletingId = action.payload;
        state.error = null;
      },
      prepare: (id: number) => ({ payload: id }),
    },
    deleteInterviewSuccess: (state, action: PayloadAction<number>) => {
      state.deletingId = null;
      state.lastDeletedId = action.payload;
    },
    deleteInterviewFailure: (state, action: PayloadAction<string>) => {
      state.deletingId = null;
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout, () => initialState);
  },
});

export const { deleteInterviewRequest, deleteInterviewSuccess, deleteInterviewFailure } =
  deleteInterviewSlice.actions;

export default deleteInterviewSlice.reducer;
