import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Crop, X, Check, Camera, UploadCloud } from "lucide-react";
import ImagePreviewModal from "../ImagePreviewModal";
import { Controller } from "react-hook-form";

// Helper function to create image element
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

// Image Cropper Modal Component
const ImageCropModal = ({ src, aspect, onComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createCroppedImage = async () => {
    try {
      const image = await createImage(src);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      // Draw the cropped section of the image onto the canvas
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return new Promise((resolve) => {
        // Convert canvas content to Blob
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          "image/jpeg",
          0.95
        );
      });
    } catch (e) {
      console.error("Error creating cropped image:", e);
      return null;
    }
  };

  const handleComplete = async () => {
    const croppedBlob = await createCroppedImage();
    if (croppedBlob) {
      onComplete(croppedBlob);
    }
  };

  if (!src) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      <div
        className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl flex flex-col transition-all duration-300 ease-out transform scale-100 opacity-100"
        style={{ animation: "fade-in-scale 0.3s forwards" }}
      >
        <div className="flex items-center justify-between p-4 rounded-t-xl bg-white border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            <Crop className="w-5 h-5 mr-2 text-lime-500" />
            Crop Image
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close Crop Modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="relative flex-1 bg-gray-100 min-h-[300px] sm:min-h-[400px] overflow-hidden">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            // Add a style to potentially improve hardware acceleration/smoothness
            // style={{ containerStyle: { transform: "translateZ(0)" } }}
          />
        </div>

        <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
          <div className="mb-4">
            <label className="text-gray-700 text-sm mb-2 block font-medium">
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05} // Smaller step for smoother control
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
              style={{ accentColor: "#84cc16" }}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600 transition-colors flex items-center justify-center font-semibold shadow-md"
              disabled={!croppedAreaPixels}
            >
              <Check className="w-5 h-5 mr-2" />
              Apply Crop
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        /* Removed data-[state=open] checks and simplified the animation for direct use on the element */
        @keyframes fade-in-scale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

// Aspect ratio configurations
const ASPECT_RATIOS = {
  portrait: 3 / 4,
  square: 1,
  landscape: 16 / 9,
};

// Photo Upload Component (main controller)
const PhotoUpload = ({
  name,
  label,
  control,
  rules,
  aspectRatio = "square",
}) => {
  const [previewImage, setPreviewImage] = useState(null);
  const [cropImage, setCropImage] = useState(null);
  const [tempFile, setTempFile] = useState(null);

  const handlePreview = (url) => setPreviewImage(url);

  const FieldUI = ({ field, fieldState, id }) => {
    const file = field.value;
    const [previewUrl, setPreviewUrl] = useState(null);

    // Creates and revokes Object URL for file preview
    React.useEffect(() => {
      if (file instanceof File || file instanceof Blob) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        setPreviewUrl(null);
      }
    }, [file]);

    const handleFileChange = (e) => {
      const uploaded = e.target.files[0];
      if (uploaded) {
        const url = URL.createObjectURL(uploaded);
        setTempFile(uploaded);
        setCropImage(url); // Trigger modal open with the image URL
      }
      e.target.value = null; // Reset file input
    };

    const handleCropComplete = (croppedBlob) => {
      const croppedFile = new File(
        [croppedBlob],
        tempFile?.name || "cropped-image.jpg",
        { type: "image/jpeg" }
      );
      field.onChange(croppedFile); // Update react-hook-form value
      setCropImage(null); // Close modal
      setTempFile(null);
    };

    return (
      <div className="mb-4">
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-600 mb-2 flex items-center"
        >
          <Camera className="w-4 h-4 mr-2 text-lime-500" />
          {label}
          <span className="text-red-500">*</span>
          <span className="ml-2 text-xs text-gray-400">({aspectRatio})</span>
        </label>

        <div className="flex flex-col items-center justify-between p-4 border-gray-200 border-2 border-dashed rounded-xl bg-gray-50 shadow-inner">
          <div className="flex items-center space-x-3 mb-3 w-full">
            {previewUrl ? (
              <div className="relative group">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-16 h-12 object-cover rounded-md shadow-md border border-gray-300 cursor-pointer"
                  onClick={() => handlePreview(previewUrl)}
                />
                <span className="absolute inset-0 bg-black bg-opacity-30 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold pointer-events-none">
                  Preview
                </span>
              </div>
            ) : (
              <Camera className="w-8 h-8 text-gray-600" />
            )}

            <span className="text-sm font-medium text-gray-900 truncate">
              {file instanceof File || file instanceof Blob
                ? file.name || "Cropped image"
                : "No photo selected"}
            </span>
          </div>

          <label
            htmlFor={id}
            className="cursor-pointer w-full px-3 py-2 text-sm rounded-lg text-white bg-lime-500 hover:opacity-90 transition-opacity flex items-center justify-center font-semibold shadow-md"
          >
            <UploadCloud className="w-5 h-5 mr-2" />
            {file ? "Change Photo" : "Upload Photo"}
            <input
              type="file"
              id={id}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>

        {fieldState.error && (
          <p className="text-red-500 text-xs mt-1">
            {fieldState.error.message}
          </p>
        )}

        <ImageCropModal
          src={cropImage}
          aspect={ASPECT_RATIOS[aspectRatio]}
          onComplete={handleCropComplete}
          onClose={() => {
            setCropImage(null);
            setTempFile(null);
          }}
        />
      </div>
    );
  };

  return (
    <>
      <ImagePreviewModal
        src={previewImage}
        onClose={() => setPreviewImage(null)}
      />
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <FieldUI field={field} fieldState={fieldState} id={name} />
        )}
      />
    </>
  );
};

export default PhotoUpload;
