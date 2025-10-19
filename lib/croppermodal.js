"use client";
import { useState, useCallback, useEffect } from "react";
import Cropper from "react-easy-crop";

export default function CropperModal({ open, onClose, onDone, existingImage, onDelete }) {
  const [imageSrc, setImageSrc] = useState(existingImage || null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [isEditing, setIsEditing] = useState(!!existingImage);

  useEffect(() => {
    if (existingImage) {
      setImageSrc(existingImage);
      setIsEditing(true);
    } else {
      setImageSrc(null);
      setIsEditing(false);
    }
  }, [existingImage]);

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
    setIsEditing(false);
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

  const handleDelete = () => {
    onDelete?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-5 flex flex-col items-center relative">
        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center">
            <p className="text-gray-700 font-semibold mb-3 text-base">
              Upload your image
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
            {/* Cuadro recortable con cuadrícula */}
            <div className="relative w-full h-60 bg-gray-100 rounded-xl overflow-hidden border-2 border-pink-200 shadow-inner">
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

            {/* Botones inferiores */}
            <div className="flex justify-center gap-3 mt-5">
              {isEditing && (
                <button
                  onClick={handleDelete}
                  className="rounded-full bg-red-100 px-4 py-1.5 font-medium text-red-700 hover:bg-red-200"
                >
                  🗑 Delete
                </button>
              )}
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
