import { createAsyncThunk } from "@reduxjs/toolkit";
import { databases } from "../../app/appwriteConfig";
import { Query } from "appwrite"; // 🔴 THIS WAS MISSING
import { uploadCoverImage } from "../../app/storageService";
import { ID } from "appwrite";
import { showSuccess, showError } from "../../utils/toast";

/**
 * CREATE POST
 */
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (
    { title, slug, content, excerpt, status, authorId, coverImage, category, tags },
    thunkAPI
  ) => {
    try {
      let coverImageId = null;

      if (coverImage) {
        coverImageId = await uploadCoverImage(coverImage);
      }

      const response = await databases.createDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        "unique()",
        {
          title,
          slug,
          content,
          excerpt,
          status,
          authorId,
          category,
          tags,
          coverImageId,
        }
      );
showSuccess("Post published successfully");
      return response;
    } catch (error) {
      showError("Failed to publish post");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * FETCH ALL POSTS
 */
export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, thunkAPI) => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID
      );

      return response.documents;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * FETCH POST BY SLUG
 */
export const fetchPostBySlug = createAsyncThunk(
  "posts/fetchPostBySlug",
  async (slug, thunkAPI) => {
    try {
      const response = await databases.listDocuments(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        [Query.equal("slug", slug)]
      );

      return response.documents[0] ?? null;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async ({ postId, data }, thunkAPI) => {
    try {
      showSuccess("Post Updated Successfully");
      return await databases.updateDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        postId,
        data
      );
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

/**
 * DELETE POST
 */
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId, thunkAPI) => {
    try {
      await databases.deleteDocument(
        import.meta.env.VITE_APPWRITE_DATABASE_ID,
        import.meta.env.VITE_APPWRITE_COLLECTION_ID,
        postId
      );
      showSuccess("Post deleted");
      return postId;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);