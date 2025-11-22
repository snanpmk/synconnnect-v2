import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "../config/firebase";

/** ---------- Helpers ---------- **/

const sanitizeFilename = (name) => {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_");
};

const generateFileName = (file) => {
  const now = new Date();
  const date = now.toISOString().split("T")[0];
  const time = now.toISOString().split("T")[1].replace(/[:.]/g, "-");
  return `${date}_${time}_${sanitizeFilename(file.name)}`;
};

/** ---------- Upload ---------- **/

export const uploadFile = (file, folderPath = "", onProgress = null) => {
  return new Promise((resolve, reject) => {
    try {
      const storage = getStorage(app);

      const fileName = generateFileName(file);
      const fullPath = folderPath ? `${folderPath}/${fileName}` : fileName;

      const fileRef = ref(storage, fullPath);
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          if (onProgress) {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          }
        },
        (error) => reject(error),
        async () => {
          try {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ url, fullPath });
          } catch (err) {
            reject(err);
          }
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

/** ---------- Delete ---------- **/

export const deleteFile = async (storagePath) => {
  try {
    const storage = getStorage(app);
    const fileRef = ref(storage, storagePath);

    await deleteObject(fileRef);
    return true;
  } catch (err) {
    throw err;
  }
};

/** ---------- Update (Replace) ---------- **/

// Replace an existing image with a new one
// fix errors
export const updateFile = async (
  newFile,
  oldFilePath,
  folderPath = "",
  onProgress = null
) => {
  try {
    // 1️⃣ Delete old file if it exists
    if (oldFilePath) await deleteFile(oldFilePath);

    // 2️⃣ Upload the new file to same folder
    return await uploadFile(newFile, folderPath, onProgress);
  } catch (err) {
    throw err;
  }
};
