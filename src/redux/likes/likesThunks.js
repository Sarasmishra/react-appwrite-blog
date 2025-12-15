import { createAsyncThunk } from "@reduxjs/toolkit";
import { databases } from "../../app/appwriteConfig";
import { Query } from "appwrite";
import {
  likeOptimistic,
  unlikeOptimistic,
} from "./likesSlice";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const LIKES_COLLECTION_ID = "likes";

/* ❤️ TOGGLE LIKE (OPTIMISTIC) */
export const toggleLike = createAsyncThunk(
  "likes/toggleLike",
  async ({ postId, userId }, { dispatch, getState }) => {
    const alreadyLiked =
      getState().likes.userLikes[postId] === true;

    try {
      if (alreadyLiked) {
        // 1️⃣ Update UI instantly
        dispatch(unlikeOptimistic(postId));

        // 2️⃣ Remove from DB
        const existing = await databases.listDocuments(
          DATABASE_ID,
          LIKES_COLLECTION_ID,
          [
            Query.equal("postId", postId),
            Query.equal("userId", userId),
          ]
        );

        if (existing.total > 0) {
          await databases.deleteDocument(
            DATABASE_ID,
            LIKES_COLLECTION_ID,
            existing.documents[0].$id
          );
        }
      } else {
        // 1️⃣ Update UI instantly
        dispatch(likeOptimistic(postId));

        // 2️⃣ Save in DB
        await databases.createDocument(
          DATABASE_ID,
          LIKES_COLLECTION_ID,
          "unique()",
          { postId, userId }
        );
      }
    } catch (error) {
      console.error("Like toggle failed", error);
      // Optional rollback could be added later
    }
  }
);

/* ❤️ FETCH LIKE COUNTS (ON LOAD / REFRESH) */
export const fetchLikes = createAsyncThunk(
  "likes/fetchLikes",
  async (postIds) => {
    const results = {};

    for (const postId of postIds) {
      const res = await databases.listDocuments(
        DATABASE_ID,
        LIKES_COLLECTION_ID,
        [Query.equal("postId", postId)]
      );
      results[postId] = res.total;
    }

    return results;
  }
);

/* ❤️ FETCH USER LIKES */
export const fetchUserLikes = createAsyncThunk(
    "likes/fetchUserLikes",
    async (userId) => {
      const res = await databases.listDocuments(
        DATABASE_ID,
        LIKES_COLLECTION_ID,
        [Query.equal("userId", userId)]
      );
  
      const userLikes = {};
      res.documents.forEach((doc) => {
        userLikes[doc.postId] = true;
      });
  
      return userLikes;
    }
  );
  