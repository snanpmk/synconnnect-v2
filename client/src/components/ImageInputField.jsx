import React, { useEffect, useState } from "react";
import { Camera, UploadCloud } from "lucide-react";

const ImageInputField = React.memo(
  ({ id, label, file, previewUrl, fieldState, onSelectFile, onPreview }) => {
    const [localPreview, setLocalPreview] = useState(null);

    useEffect(() => {
      if (file instanceof File) {
        const url = URL.createObjectURL(file);
        setLocalPreview(url);
        return () => URL.revokeObjectURL(url);
      }
    }, [file]);

    useEffect(() => {
      if (previewUrl) setLocalPreview(previewUrl);
    }, [previewUrl]);

    return (
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600 mb-2 flex items-center">
          <Camera className="w-4 h-4 mr-2 text-primary" />
          {label}
          <span className="text-red-500">*</span>
        </label>

        <div className="p-4 border-2 border-dashed bg-gray-50 rounded-xl">
          <div className="flex items-center space-x-3 mb-3">
            {localPreview ? (
              <img
                src={localPreview}
                className="w-16 h-12 object-cover rounded-md border cursor-pointer"
                onClick={() => onPreview(localPreview)}
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-600" />
            )}

            <span className="text-sm font-medium text-gray-900 truncate">
              {file instanceof File ? file.name : "No photo selected"}
            </span>
          </div>

          <label
            htmlFor={id}
            className="cursor-pointer w-full px-3 py-2 bg-primary text-white rounded-lg flex items-center justify-center"
          >
            <UploadCloud className="w-5 h-5 mr-2" />
            {file ? "Change Photo" : "Upload Photo"}
            <input
              type="file"
              id={id}
              accept="image/*"
              className="hidden"
              onChange={(e) => onSelectFile(e.target.files[0])}
            />
          </label>
        </div>

        {fieldState.error && (
          <p className="text-red-500 text-xs mt-1">
            {fieldState.error.message}
          </p>
        )}
      </div>
    );
  }
);

export default ImageInputField;
