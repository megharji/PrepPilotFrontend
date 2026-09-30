import { createSlice, nanoid } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type SnackbarType = "success" | "error" | "info";

export interface SnackbarItem {
  id: string;
  type: SnackbarType;
  message: string;
}

// Ek saath itne se zyada nahi dikhate, purane hata dete hain
const MAX_VISIBLE = 3;

interface SnackbarState {
  items: SnackbarItem[];
}

const initialState: SnackbarState = {
  items: [],
};

// Poori app ke success/error messages (zyada tar backend ka `message`). Sagas se dispatch hote hain.
const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    showSnackbar: {
      reducer: (state, action: PayloadAction<SnackbarItem>) => {
        state.items = [...state.items, action.payload].slice(-MAX_VISIBLE);
      },
      prepare: (payload: { type: SnackbarType; message: string }) => ({
        payload: { id: nanoid(), ...payload },
      }),
    },
    hideSnackbar: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { showSnackbar, hideSnackbar } = snackbarSlice.actions;

export default snackbarSlice.reducer;
