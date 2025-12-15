import { databases } from "../app/appwriteConfig";

export const getAllPosts = async () => {
  return databases.listDocuments(
    import.meta.env.VITE_DB_ID,
    import.meta.env.VITE_POSTS_COLLECTION_ID
  );
};
