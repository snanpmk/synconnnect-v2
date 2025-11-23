import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Crop, X, Check } from "lucide-react";

// Helper function to create image element (kept outside for clarity)
const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      {/* Semi-transparent overlay to click outside and close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Dialog Content: Relative, White Background, Max-width for dialog appearance */}
      <div className="relative bg-white w-full max-w-xl rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header: Light Theme */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center">
            {/* Icon color updated to primary/500 */}
            <Crop className="w-5 h-5 mr-2 text-primary-bg-primary-hover" />
            Crop Image
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cropper Area: Flexible height */}
        <div className="relative flex-1 min-h-[300px] overflow-hidden">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Footer/Controls: Light Theme */}
        <div className="p-4 border-t border-gray-200">
          <div className="mb-4">
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Zoom
            </label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-lg"
              // Custom color for range input thumb/track: updated to primary (#a3e635)
              style={{ accentColor: "#a3e635" }}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium border border-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              // Button background updated to primary
              // Hover effect updated to a slightly darker shade, primary-bg-primary-hover
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors flex items-center justify-center font-semibold shadow-md"
            >
              <Check className="w-5 h-5 mr-2" />
              Apply Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
