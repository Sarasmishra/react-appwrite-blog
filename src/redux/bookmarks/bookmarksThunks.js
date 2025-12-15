import { createAsyncThunk } from "@reduxjs/toolkit";
import { databases } from "../../app/appwriteConfig";
import { Query } from "appwrite";
import {
  bookmarkOptimistic,
  unbookmarkOptimistic,
} from "./bookmarksSlice";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const BOOKMARKS_COLLECTION_ID = "bookmarks";

/* 🔖 TOGGLE BOOKMARK */
export const toggleBookmark = createAsyncThunk(
  "bookmarks/toggle",
  async ({ postId, userId }, { dispatch, getState }) => {
    const bookmarked =
      getState().bookmarks.userBookmarks[postId] === true;

    try {
      if (bookmarked) {
        // UI first
        dispatch(unbookmarkOptimistic(postId));

        const res = await databases.listDocuments(
          DATABASE_ID,
          BOOKMARKS_COLLECTION_ID,
          [
            Query.equal("postId", postId),
            Query.equal("userId", userId),
          ]
        );

        if (res.total > 0) {
          await databases.deleteDocument(
            DATABASE_ID,
            BOOKMARKS_COLLECTION_ID,
            res.documents[0].$id
          );
        }
      } else {
        dispatch(bookmarkOptimistic(postId));

        await databases.createDocument(
          DATABASE_ID,
          BOOKMARKS_COLLECTION_ID,
          "unique()",
          { postId, userId }
        );
      }
    } catch (err) {
      console.error("Bookmark toggle failed", err);
    }
  }
);

/* 🔖 FETCH USER BOOKMARKS */
export const fetchUserBookmarks = createAsyncThunk(
  "bookmarks/fetchUser",
  async (userId) => {
    const res = await databases.listDocuments(
      DATABASE_ID,
      BOOKMARKS_COLLECTION_ID,
      [Query.equal("userId", userId)]
    );

    const bookmarks = {};
    res.documents.forEach((doc) => {
      bookmarks[doc.postId] = true;
    });

    return bookmarks;
  }
);
