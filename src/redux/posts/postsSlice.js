import { createSlice } from "@reduxjs/toolkit";
import {
  fetchPosts,
  fetchPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from "./postsThunks";

const initialState = {
  posts: [],
  selectedPost: null,
  loading: false,
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ALL POSTS
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })

      // SINGLE POST
      .addCase(fetchPostBySlug.pending, (state) => {
        state.loading = true;
        state.selectedPost = null;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action) => {
        state.selectedPost = action.payload;
        state.loading = false;
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
        .addCase(updatePost.fulfilled, (state, action) => {
    state.selectedPost = action.payload;
  })

  .addCase(deletePost.fulfilled, (state, action) => {
    state.posts = state.posts.filter(
      (post) => post.$id !== action.payload
    );
    state.selectedPost = null;
  });
  },
});

export default postsSlice.reducer;
