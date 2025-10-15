"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function CropperModal({ aspect = 16 / 9, onClose, onConfirm }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState(null);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_croppedArea, croppedAreaPixels) => {
    setArea(croppedAreaPixels);
  }, []);

  const makeCropped = async () => {
    if (!imageSrc || !area) return;
    const img = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = area.width;
    canvas.height = area.height;
    ctx.drawImage(
      img,
      area.x,
      area.y,
      area.width,
      area.height,
      0,
      0,
      area.width,
      area.height
    );
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      onConfirm?.(url);
    }, "image/jpeg", 0.92);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-3xl w-11/12 max-w-2xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Add & Crop your photo</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {!imageSrc ? (
          <div className="p-6 text-center">
            <input type="file" accept="image/*" onChange={onFile} />
            <p className="text-sm text-gray-500 mt-2">
              Tip: use a clear image; you can crop and zoom to fit the template.
            </p>
          </div>
        ) : (
          <div className="relative" style={{ height: 320 }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-gray-100">Cancel</button>
          <button
            onClick={makeCropped}
            disabled={!imageSrc}
            className="px-4 py-2 rounded-full bg-purple-600 text-white disabled:opacity-50"
          >
            Use Photo
          </button>
        </div>
      </div>
    </div>
  );
}

/* helpers */
function createImage(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}
