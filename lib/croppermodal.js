"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";

export default function CropperModal({ open, onClose, onDone }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.crossOrigin = "anonymous";
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, crop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = crop.width;
    canvas.height = crop.height;
    ctx.drawImage(
      image,
      crop.x,
      crop.y,
      crop.width,
      crop.height,
      0,
      0,
      crop.width,
      crop.height
    );
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(URL.createObjectURL(blob)), "image/jpeg");
    });
  };

  const handleDone = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const cropped = await getCroppedImg(imageSrc, croppedAreaPixels);
    onDone(cropped);
    onClose();
  };

  if (!open) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // 🔥 z-index más alto que cualquier otro contenedor (animaciones o botones)
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div className="relative w-[92%] max-w-md rounded-3xl bg-white p-5 shadow-2xl">
        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center text-center space-y-3">
            <p className="font-semibold text-gray-700">
              Upload or Take a Picture
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer rounded-full border border-pink-300 bg-pink-50 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-pink-100"
            />
          </div>
        ) : (
          <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-gray-200">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              showGrid={false}
            />
          </div>
        )}

        <div className="mt-5 flex justify-between">
          <button
            onClick={onClose}
            className="rounded-full bg-gray-200 px-5 py-2 font-semibold text-gray-700"
          >
            Cancel
          </button>
          {imageSrc && (
            <button
              onClick={handleDone}
              className="rounded-full bg-pink-500 px-5 py-2 font-semibold text-white hover:bg-pink-600"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
        }
