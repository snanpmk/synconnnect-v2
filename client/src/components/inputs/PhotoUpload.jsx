import React, { useState, useEffect } from "react";
import { Controller, useWatch } from "react-hook-form";
import Cropper from "react-easy-crop";
import { IMAGE_CONFIG, IMAGE_TYPES } from "../../config/imageSize";
import { Camera, UploadCloud, Crop, X, Check } from "lucide-react";

/* ------------ HELPER: Load image ------------ */
const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/* ------------ CROP MODAL ------------ */
const ImageCropModal = ({ src, aspect, onComplete, onClose }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState(null);

  const handleCrop = async () => {
    if (!areaPixels) return;

    const img = await loadImage(src);
    const canvas = document.createElement("canvas");
    canvas.width = areaPixels.width;
    canvas.height = areaPixels.height;

    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      img,
      areaPixels.x,
      areaPixels.y,
      areaPixels.width,
      areaPixels.height,
      0,
      0,
      areaPixels.width,
      areaPixels.height
    );

    canvas.toBlob((blob) => onComplete(blob), "image/jpeg");
  };

  if (!src) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-3xl h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold flex items-center">
            <Crop className="w-5 h-5 text-primary mr-2" /> Crop Image
          </h2>
          <button onClick={onClose}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>

        <div className="relative flex-1 bg-gray-100">
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={(croppedArea, pixels) => setAreaPixels(pixels)}
          />
        </div>

        <div className="p-4 flex gap-3 border-t">
          <button onClick={onClose} className="flex-1 bg-gray-200 py-2 rounded">
            Cancel
          </button>
          <button
            disabled={!areaPixels}
            onClick={handleCrop}
            className="flex-1 bg-primary text-white py-2 rounded flex items-center justify-center"
          >
            <Check className="w-5 h-5 mr-2" /> Apply
          </button>
        </div>
      </div>
    </div>
  );
};

/* ------------ PREVIEW MODAL ------------ */
const ImagePreviewModal = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <img
        src={src}
        className="max-w-full max-h-full rounded shadow-lg"
        alt="Preview"
      />
      <button
        className="absolute top-4 right-4 bg-white rounded-full p-2 shadow"
        onClick={onClose}
      >
        <X className="w-6 h-6 text-gray-700" />
      </button>
    </div>
  );
};

/* ------------ MAIN COMPONENT ------------ */
const PhotoUpload = ({
  name,
  control,
  label = "Upload Photo",
  rules = {},
  aspectRatio = null,
}) => {
  const [cropSrc, setCropSrc] = useState(null);
  const [tempFile, setTempFile] = useState(null);
  const [previewModal, setPreviewModal] = useState(null);
  const [selectedType, setSelectedType] = useState(aspectRatio);

  /* ------------ Open Cropper with uploaded file ------------ */
  const openCropper = (file) => {
    const url = URL.createObjectURL(file);
    setTempFile(file);
    setCropSrc(url);
  };

  /* ------------ After Cropping Save File ------------ */
  const applyCrop = (blob, onChange) => {
    const croppedFile = new File([blob], tempFile.name, { type: "image/jpeg" });
    onChange(croppedFile);

    setCropSrc(null);
    setTempFile(null);
  };

  return (
    <>
      {/* Preview Modal */}
      <ImagePreviewModal
        src={previewModal}
        onClose={() => setPreviewModal(null)}
      />

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => {
          const value = field.value;

          /* ------------ Universal Preview Handler ------------ */
          let preview = null;

          if (value instanceof File) {
            preview = URL.createObjectURL(value);
          } else if (typeof value === "string") {
            preview = value;
          } else if (value?.url) {
            preview = value.url; // firebase object support
          }

          /* ------------ Cleanup Blob URLs ------------ */
          useEffect(() => {
            if (value instanceof File && preview) {
              return () => URL.revokeObjectURL(preview);
            }
          }, [value]);

          return (
            <div className="mb-4">
              {/* Label */}
              <label className="text-gray-700 font-medium text-sm flex items-center mb-2">
                <Camera className="w-4 h-4 mr-2 text-primary" />
                {label}
                {rules.required && <span className="text-red-500">*</span>}
              </label>

              {/* Aspect selector */}
              {!aspectRatio && (
                <div className="flex gap-4 mb-3">
                  {IMAGE_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-1">
                      <input
                        type="radio"
                        checked={selectedType === type}
                        onChange={() => setSelectedType(type)}
                      />
                      {IMAGE_CONFIG[type].label}
                    </label>
                  ))}
                </div>
              )}

              {/* Upload Box */}
              <div className="border-2 border-dashed rounded-xl p-4 bg-gray-50 text-center">
                {preview ? (
                  <img
                    src={preview}
                    className="w-44 h-44 mx-auto rounded shadow cursor-pointer object-contain"
                    onClick={() => setPreviewModal(preview)}
                  />
                ) : (
                  <Camera className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                )}

                <label className="mt-3 inline-flex items-center px-3 py-2 bg-primary text-white rounded cursor-pointer">
                  <UploadCloud className="w-5 h-5 mr-2" />
                  {preview ? "Change Photo" : "Upload Photo"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (!selectedType) {
                        alert("Please select type first");
                        return;
                      }
                      openCropper(e.target.files[0]);
                    }}
                  />
                </label>

                {/* Error */}
                {fieldState.error && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>

              {/* Crop Modal */}
              <ImageCropModal
                src={cropSrc}
                aspect={IMAGE_CONFIG[selectedType]?.aspect}
                onComplete={(blob) => applyCrop(blob, field.onChange)}
                onClose={() => setCropSrc(null)}
              />
            </div>
          );
        }}
      />
    </>
  );
};

export default PhotoUpload;
