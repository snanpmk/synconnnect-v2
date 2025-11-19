import React from "react";

const PreviewOverlay = React.memo(({ url, onClose }) => {
  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <img src={url} className="max-h-[90vh] max-w-[90vw]" />
    </div>
  );
});

export default PreviewOverlay;
