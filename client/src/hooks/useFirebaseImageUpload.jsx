import { useState } from "react";
import { deleteFile, updateFile, uploadFile } from "../services/storage";

export const useFirebaseImageUpload = () => {
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(null);
  const [fullPath, setFullPath] = useState(null);

  const upload = async (file, folderPath = "") => {
    setUploading(true);
    setProgress(0);

    try {
      const res = await uploadFile(file, folderPath, (p) => setProgress(p));
      setUrl(res.url);
      setFullPath(res.fullPath);
      return res;
    } finally {
      setUploading(false);
    }
  };

  /** Update image (delete old + upload new) */
  const update = async (newFile, oldPath, folderPath = "") => {
    setUploading(true);
    setProgress(0);

    try {
      const res = await updateFile(newFile, oldPath, folderPath, (p) =>
        setProgress(p)
      );
      setUrl(res.url);
      setFullPath(res.fullPath);
      return res;
    } finally {
      setUploading(false);
    }
  };

  /** Delete any image */
  const remove = async (storagePath) => {
    await deleteFile(storagePath);
    setUrl(null);
    setFullPath(null);
  };

  return {
    uploading,
    progress,
    url,
    fullPath,
    upload,
    update,
    remove,
  };
};
