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
 * 2. Resize using Canvas
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

    // Auto-calc height if keep aspect
    if (!height && preserveAspectRatio) {
      const ratio = image.width / image.height;
      targetHeight = Math.round(width / ratio);
    }

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

    canvas.toBlob(
      (blob) => {
        resolve(
          new File([blob], fileName, {
            type: outputType,
            lastModified: Date.now(),
          })
        );
      },
      outputType,
      quality
    );
  });
};

/**
 * ------------------------------
 * 3. Compression Loop
 * ------------------------------
 */
export const compressImage = (file, maxKB = 500) => {
  return new Promise(async (resolve, reject) => {
    let quality = 1.0;
    let compressed = file;

    const compressOnce = (file, quality) =>
      new Promise((resolve, reject) => {
        new Compressor(file, {
          quality,
          convertSize: 0,
          success: resolve,
          error: reject,
        });
      });

    try {
      while (compressed.size > maxKB * 1024 && quality > 0.1) {
        quality -= 0.1;
        compressed = await compressOnce(file, quality);
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
 * 4. Master processImage (using unified IMAGE_CONFIG)
 * ------------------------------
 */
export const processImage = async (
  file,
  type,
  { maxKB = 500, preserveAspectRatio = false, outputType = "image/jpeg" } = {}
) => {
  try {
    if (!(file instanceof File)) {
      throw new Error("Input must be a File object");
    }

    const config = IMAGE_CONFIG[type];
    if (!config) throw new Error("Unknown image type: " + type);

    const image = await fileToImage(file);

    // 1. RESIZE using unified config
    const resizedFile = await resizeImage(image, {
      width: config.width,
      height: config.height,
      outputType,
      preserveAspectRatio,
      fileName: file.name,
    });

    // 2. IF already small enough → return
    if (resizedFile.size / 1024 <= maxKB) return resizedFile;

    // 3. COMPRESS LOWER SIZE
    const compressed = await compressImage(resizedFile, maxKB);

    return compressed;
  } catch (error) {
    console.error("Error in processImage:", error);
    return null;
  }
};
