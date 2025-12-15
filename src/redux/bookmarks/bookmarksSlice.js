import { createSlice } from "@reduxjs/toolkit";
import { fetchUserBookmarks } from "./bookmarksThunks";

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState: {
    userBookmarks: {}, // postId -> true
  },

  reducers: {
    bookmarkOptimistic: (state, action) => {
      const postId = action.payload;
      state.userBookmarks[postId] = true;
    },
    unbookmarkOptimistic: (state, action) => {
      const postId = action.payload;
      delete state.userBookmarks[postId];
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchUserBookmarks.fulfilled, (state, action) => {
      state.userBookmarks = action.payload;
    });
  },
});

export const {
  bookmarkOptimistic,
  unbookmarkOptimistic,
} = bookmarksSlice.actions;

export default bookmarksSlice.reducer;
