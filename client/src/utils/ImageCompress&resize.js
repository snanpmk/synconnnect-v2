import Compressor from "compressorjs";
import { IMAGE_CONFIG } from "../config/imageSize";

/**
 * ------------------------------
 * 1. Convert File → HTMLImageElement
 * ------------------------------
 */
export const fileToImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * ------------------------------
 * 2. Resize using Canvas (NO STRETCHING)
 * ------------------------------
 */
export const resizeImage = (
  image,
  {
    width = 800,
    height = null,
    preserveAspectRatio = true,
    outputType = "image/jpeg",
    quality = 0.9,
    fileName = "image.jpg",
  } = {}
) => {
  return new Promise((resolve) => {
    let targetWidth = width;
    let targetHeight = height;

    const originalRatio = image.width / image.height;

    // Maintain aspect ratio correctly
    if (preserveAspectRatio) {
      if (width && !height) {
        targetHeight = Math.round(width / originalRatio);
      } else if (!width && height) {
        targetWidth = Math.round(height * originalRatio);
      } else if (width && height) {
        // bounding box behavior
        if (image.width / width > image.height / height) {
          targetHeight = Math.round(width / originalRatio);
        } else {
          targetWidth = Math.round(height * originalRatio);
        }
      }
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    canvas.toBlob(
      (blob) => {
        const file = new File([blob], fileName, {
          type: outputType,
          lastModified: Date.now(),
        });
        resolve({ file, width: targetWidth, height: targetHeight });
      },
      outputType,
      quality
    );
  });
};

/**
 * ------------------------------
 * 3. Compression Loop (Dimension-Safe)
 * ------------------------------
 */
export const compressImage = (file, maxKB = 500, dimensions) => {
  const { width, height } = dimensions;

  return new Promise(async (resolve, reject) => {
    let quality = 1.0;
    let compressed = file;

    const compressOnce = (file, q) =>
      new Promise((resolve, reject) => {
        new Compressor(file, {
          quality: q,
          convertSize: 0,
          resize: "none", // 🔥 critical: disable its resizing logic
          width, // 🔥 force same width
          height, // 🔥 force same height
          success: resolve,
          error: reject,
        });
      });

    try {
      while (compressed.size > maxKB * 1024 && quality > 0.1) {
        quality -= 0.1;
        compressed = await compressOnce(compressed, quality);
      }

      resolve(
        new File([compressed], file.name, {
          type: "image/jpeg",
          lastModified: Date.now(),
        })
      );
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * ------------------------------
 * 4. Master processImage (Final Pipeline)
 * ------------------------------
 */
export const processImage = async (
  file,
  type,
  { maxKB = 500, preserveAspectRatio = true, outputType = "image/jpeg" } = {}
) => {
  try {
    if (!(file instanceof File)) {
      throw new Error("Input must be a File object");
    }

    const config = IMAGE_CONFIG[type];
    if (!config) throw new Error("Unknown image type: " + type);

    const image = await fileToImage(file);

    // 1. Resize (returns file + dimensions)
    const {
      file: resizedFile,
      width,
      height,
    } = await resizeImage(image, {
      width: config.width,
      height: config.height,
      preserveAspectRatio,
      outputType,
      fileName: file.name,
    });

    if (resizedFile.size / 1024 <= maxKB) return resizedFile;

    // 3. Compress with dimension safety
    const compressed = await compressImage(resizedFile, maxKB, {
      width,
      height,
    });

    return compressed;
  } catch (error) {
    console.error("Error in processImage:", error);
    return null;
  }
};
