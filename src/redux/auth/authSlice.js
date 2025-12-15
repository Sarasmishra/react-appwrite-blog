import { createSlice } from "@reduxjs/toolkit";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  signupUser,
} from "./authThunks";



const initialState = {
  user: null,
  loading: false,
  error: null,
  authChecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.authChecked = true; // ✅ REQUIRED
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // RESTORE SESSION (IMPORTANT)
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.authChecked = true;
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.authChecked = true;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.authChecked = true;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
