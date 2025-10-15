// lib/croppermodal.js
"use client";

import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

export default function CropperModal({ onClose, onSave }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImageSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const cropImage = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const { width, height, x, y } = croppedAreaPixels;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);
    const base64 = canvas.toDataURL("image/jpeg", 0.9);
    onSave(base64);
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", reject);
      img.src = url;
    });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-6 w-11/12 max-w-md shadow-xl relative"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <h3 className="text-lg font-semibold text-center mb-3">
          Upload and Adjust Image
        </h3>

        {!imageSrc ? (
          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-3"
            />
          </div>
        ) : (
          <div className="relative w-full h-64 bg-gray-200 rounded-xl overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {imageSrc && (
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setImageSrc(null)}
              className="px-4 py-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
            >
              Change
            </button>
            <button
              onClick={cropImage}
              className="px-4 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition"
            >
              Apply
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
