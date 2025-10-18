"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

/**
 * CropperModal.js
 * Modal para recortar imagen, con cuadrícula, zoom y vista previa tipo Everwish.
 */
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
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md overflow-hidden p-5">
        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-700 font-semibold mb-4 text-lg">Upload your image</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-gray-600"
            />
          </div>
        ) : (
          <>
            <div className="relative w-full h-72 bg-gray-100 rounded-xl overflow-hidden">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                showGrid={true}
                cropShape="rect"
                onCropChange={setCrop}
                onZoomChange={setZoom}
              />
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 w-2/3 mx-auto">
              <span className="text-gray-500 text-sm">-</span>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-yellow-400"
              />
              <span className="text-gray-500 text-sm">+</span>
            </div>

            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={onClose}
                className="rounded-full bg-gray-200 px-5 py-2 font-medium text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDone}
                className="rounded-full bg-yellow-400 px-6 py-2 font-semibold text-[#3b2b1f] hover:bg-yellow-300"
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
