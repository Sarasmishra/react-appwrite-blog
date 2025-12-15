import { createAsyncThunk } from "@reduxjs/toolkit";
import { account,ID  } from "../../app/appwriteConfig";
import { showSuccess, showError } from "../../utils/toast";

/**
 * LOGIN USER
 */

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, thunkAPI) => {
    try {
      await account.createEmailPasswordSession(email, password);

      showSuccess("Login successful");

      // IMPORTANT: do NOT call account.get() here
      return true;
    } catch (err) {
      showError("Invalid email or password");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

/**
 * RESTORE USER SESSION ON APP LOAD
 */
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, thunkAPI) => {
    try {
      return await account.get();
    } catch (error) {
      // 🔑 IMPORTANT:
      // This 401 is NORMAL for logged-out users
      return null;
    }
  }
);


/**
 * LOGOUT USER
 */
export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await account.deleteSession("current");
  showSuccess("Logged out successfully");
});


export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ name, email, password }, thunkAPI) => {
    try {
      // 1. Create account
      await account.create(ID.unique(), email, password, name);

      // 2. Auto-login
      await account.createEmailPasswordSession(email, password);

      showSuccess("Account created successfully");

      // IMPORTANT: follow same pattern as login
      return true;
    } catch (err) {
      showError("Registration failed");
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);