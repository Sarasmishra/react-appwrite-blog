import { createAsyncThunk } from "@reduxjs/toolkit";
import { databases } from "../../app/appwriteConfig";
import { Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COMMENTS_COLLECTION_ID = "commets";

/* 🗨️ FETCH COMMENTS FOR A POST */
export const fetchCommentsByPost = createAsyncThunk(
  "comments/fetchByPost",
  async (postId) => {
    const res = await databases.listDocuments(
      DATABASE_ID,
      COMMENTS_COLLECTION_ID,
      [
        Query.equal("postId", postId),
        Query.orderDesc("$createdAt"),
      ]
    );

    return res.documents;
  }
);

/* ➕ ADD COMMENT */
export const addComment = createAsyncThunk(
  "comments/add",
  async ({ postId, userId, content }) => {
    const doc = await databases.createDocument(
      DATABASE_ID,
      COMMENTS_COLLECTION_ID,
      "unique()",
      {
        postId,
        userId,
        content,
      }
    );

    return doc;
  }
);

/* 🗑️ DELETE COMMENT */
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (commentId) => {
    await databases.deleteDocument(
      DATABASE_ID,
      COMMENTS_COLLECTION_ID,
      commentId
    );

    return commentId;
  }
);
