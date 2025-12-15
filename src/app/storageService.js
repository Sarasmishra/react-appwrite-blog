import { storage } from "./appwriteConfig";
import { ID } from "appwrite";

const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID;

/* ---------- UPLOAD (GENERIC) ---------- */
export const uploadFile = async (file) => {
  const uploaded = await storage.createFile(
    BUCKET_ID,
    ID.unique(),
    file
  );
  return uploaded.$id;
};

/* ---------- FILE URL ---------- */
export const getFileUrl = (fileId) => {
  return storage.getFileView(BUCKET_ID, fileId);
};

/* ---------- BACKWARD COMPAT (OPTIONAL) ---------- */
// If you already use these elsewhere, keep them
export const uploadCoverImage = uploadFile;
export const getCoverImageUrl = getFileUrl;
