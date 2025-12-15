import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/auth/authSlice";
import postsReducer from "../redux/posts/postsSlice";
import commentsReducer from "../redux/comments/commentsSlice";
import uiReducer from "../redux/ui/uiSlice";
import likesReducer from "../redux/likes/likesSlice";
import bookmarksReducer from "../redux/bookmarks/bookmarksSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentsReducer,
    ui: uiReducer,
    likes: likesReducer,
    bookmarks: bookmarksReducer,
  },
});
