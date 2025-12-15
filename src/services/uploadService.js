import { storage } from "../app/appwriteConfig";

export const uploadImage = async (file) => {
  try {
    const response = await storage.createFile(
      import.meta.env.VITE_APPWRITE_BUCKET_ID,
      "unique()",
      file
    );
    return response.$id;
  } catch (error) {
    throw error;
  }
};
