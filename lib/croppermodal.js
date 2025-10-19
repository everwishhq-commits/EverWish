"use client";
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function CropperModal({ open, onClose, onDone }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const getCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return null;
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");

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
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, "image/jpeg");
    });
  }, [imageSrc, croppedAreaPixels]);

  const handleDone = async () => {
    const cropped = await getCroppedImage();
    if (cropped) onDone(cropped);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm touch-none">
      <div className="relative w-[90%] max-w-sm rounded-2xl bg-white p-4">
        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="rounded-xl border p-2 text-gray-600"
            />
            <button
              onClick={onClose}
              className="rounded-full bg-gray-300 px-4 py-2 font-semibold text-gray-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <>
            <div className="relative w-full h-[300px] bg-black/80 rounded-xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1.6} // 🔹 Mantiene relación tipo banner (más horizontal)
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                showGrid={true}
                restrictPosition={false}
              />
            </div>

            {/* Controles */}
            <div className="mt-4 flex items-center justify-center space-x-4">
              <button
                onClick={() => setZoom((z) => Math.max(1, z - 0.2))}
                className="rounded-full bg-gray-200 px-3 py-2 text-gray-700 font-bold"
              >
                -
              </button>
              <button
                onClick={() => setZoom((z) => Math.min(3, z + 0.2))}
                className="rounded-full bg-gray-200 px-3 py-2 text-gray-700 font-bold"
              >
                +
              </button>
            </div>

            {/* Botones de acción */}
            <div className="mt-5 flex justify-between">
              <button
                onClick={onClose}
                className="rounded-full bg-gray-200 px-4 py-2 font-semibold text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDone}
                className="rounded-full bg-yellow-400 px-6 py-2 font-semibold text-[#3b2b1f]"
              >
                Done
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// 🧠 Helper para convertir imagen en elemento
async function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = (e) => reject(e);
  });
          }
