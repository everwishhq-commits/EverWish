"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function CropperModal({ open, onClose, onDone }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });

  const getCroppedImg = useCallback(async () => {
    if (!imageSrc) return null;
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const size = Math.min(image.width, image.height);
    const startX = (image.width - size) / 2;
    const startY = (image.height - size) / 2;
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(image, startX, startY, size, size, 0, 0, size, size);
    return canvas.toDataURL("image/jpeg");
  }, [imageSrc]);

  const handleDone = async () => {
    const cropped = await getCroppedImg();
    if (cropped) {
      onDone(cropped);
      setImageSrc(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    }
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[88%] max-w-sm overflow-hidden p-5">
        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-700 font-semibold mb-3 text-base">
              Choose an image
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-gray-600"
            />
          </div>
        ) : (
          <>
            {/* 🔹 Crop area más corta */}
            <div className="relative w-full h-52 bg-gray-100 rounded-xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                showGrid={false}
                cropShape="rect"
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            </div>

            {/* Vista previa instantánea */}
            <div className="mt-3 flex justify-center">
              <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-pink-300 shadow-inner">
                <img
                  src={imageSrc}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-center gap-4 mt-5">
              <button
                onClick={onClose}
                className="rounded-full bg-gray-200 px-4 py-1.5 font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDone}
                className="rounded-full bg-yellow-400 px-5 py-1.5 font-semibold text-[#3b2b1f] hover:bg-yellow-300"
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
