import { createSlice } from "@reduxjs/toolkit";
import { toggleLike, fetchLikes, fetchUserLikes } from "./likesThunks";

const likesSlice = createSlice({
  name: "likes",
  initialState: {
    counts: {},      // postId -> number
    userLikes: {},   // postId -> boolean
  },

  reducers: {
    // ✅ OPTIMISTIC LIKE
    likeOptimistic: (state, action) => {
      const postId = action.payload;
      state.userLikes[postId] = true;
      state.counts[postId] = (state.counts[postId] || 0) + 1;
    },

    // ✅ OPTIMISTIC UNLIKE (SAFE)
    unlikeOptimistic: (state, action) => {
      const postId = action.payload;
      state.userLikes[postId] = false;
      state.counts[postId] = Math.max(
        (state.counts[postId] || 1) - 1,
        0
      );
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchLikes.fulfilled, (state, action) => {
      // Hydrate counts from DB (on load / refresh)
      state.counts = action.payload;
    })
    .addCase(fetchUserLikes.fulfilled, (state, action) => {
        state.userLikes = action.payload;
      });
  },
});

export const {
  likeOptimistic,
  unlikeOptimistic,
} = likesSlice.actions;

export default likesSlice.reducer;
