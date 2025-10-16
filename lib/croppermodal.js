// /lib/croppermodal.js
"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

/**
 * Props:
 * - open (bool)
 * - onClose()
 * - onSave(base64String)
 * - initialImage (optional base64/string)
 */
export default function CropperModal({ open, onClose, onSave, initialImage = null }) {
  const [imageSrc, setImageSrc] = useState(initialImage);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [areaPixels, setAreaPixels] = useState(null);

  if (!open) return null;

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setAreaPixels(croppedAreaPixels);
  }, []);

  const pickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result.toString());
    reader.readAsDataURL(file);
  };

  const getCroppedImg = async () => {
    if (!imageSrc || !areaPixels) {
      onClose?.();
      return;
    }
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const { width, height, x, y } = areaPixels;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    const base64 = canvas.toDataURL("image/jpeg", 0.92);
    onSave?.(base64);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/70 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-semibold text-pink-600">Add & Crop your photo</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div className="p-4">
          {!imageSrc ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-6 text-center">
              <p className="mb-3 text-gray-600">Upload an image to start</p>
              <input type="file" accept="image/*" onChange={pickFile} className="block" />
            </div>
          ) : (
            <div className="relative w-full h-[360px] bg-black rounded-xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={9/16}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                restrictPosition={false}
                objectFit="cover"
              />
            </div>
          )}

          {/* Controles */}
          {imageSrc && (
            <div className="mt-4">
              <label className="block text-sm text-gray-600 mb-1">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-full bg-gray-100 hover:bg-gray-200">Cancel</button>
          <button onClick={getCroppedImg} className="px-4 py-2 rounded-full text-white bg-pink-500 hover:bg-pink-600">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (e) => reject(e));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
            }
