"use client";
import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

export default function CropperModal({ open, onClose, onDone }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  // Manejar selección de imagen
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Convertir crop a imagen final
  const getCroppedImg = useCallback(async () => {
    if (!imageSrc) return null;
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const cropArea = {
      width: image.width / zoom,
      height: image.height / zoom,
      x: (image.width - image.width / zoom) / 2 - crop.x * (image.width / 100),
      y: (image.height - image.height / zoom) / 2 - crop.y * (image.height / 100),
    };

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;
    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    return canvas.toDataURL("image/jpeg");
  }, [imageSrc, crop, zoom]);

  const handleDone = async () => {
    const cropped = await getCroppedImg();
    if (cropped) {
      onDone(cropped);
      setImageSrc(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md overflow-hidden flex flex-col items-center p-4">
        {!imageSrc ? (
          <div className="flex flex-col items-center">
            <p className="mb-3 text-gray-700 font-semibold text-lg">Upload your image</p>
            <input
              type="file"
              accept="image/*"
              className="text-sm text-gray-600"
              onChange={handleFileChange}
            />
          </div>
        ) : (
          <>
            {/* 🟩 Área de crop con cuadrícula */}
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

            {/* Zoom */}
            <div className="flex items-center justify-center gap-2 mt-4 w-2/3">
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

            {/* Botones */}
            <div className="flex justify-center gap-4 mt-5">
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

// 🔧 Crear objeto imagen
function createImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });
          }
