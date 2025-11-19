import React from "react";
import { X } from "lucide-react";

const ImagePreviewModal = ({ src, onClose }) => {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/10  bg-opacity-75 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative p-4 max-w-lg w-full max-h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-3 right-0  p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors z-10 shadow-lg"
          aria-label="Close image preview"
        >
          <X className="w-6 h-6 cursor-pointer" />
        </button>
        <img
          src={src}
          alt="Preview"
          className="w-full max-h-[80vh] object-contain rounded-lg  "
        />
      </div>
    </div>
  );
};

export default ImagePreviewModal;
