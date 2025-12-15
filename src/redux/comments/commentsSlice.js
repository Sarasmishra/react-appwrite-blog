import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCommentsByPost,
  addComment,
  deleteComment,
} from "./commentsThunks";

const commentsSlice = createSlice({
  name: "comments",
  initialState: {
    comments: [],
    loading: false,
    adding: false,
    deletingId: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      /* Fetch */
      .addCase(fetchCommentsByPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentsByPost.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.loading = false;
      })

      /* Add */
      .addCase(addComment.pending, (state) => {
        state.adding = true;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.comments.unshift(action.payload);
        state.adding = false;
      })

      /* Delete */
      .addCase(deleteComment.pending, (state, action) => {
        state.deletingId = action.meta.arg;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(
          (c) => c.$id !== action.payload
        );
        state.deletingId = null;
      });
  },
});

export default commentsSlice.reducer;
