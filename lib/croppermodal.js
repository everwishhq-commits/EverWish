"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";

export default function CropperModal({ image, onClose, onSave }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedPixels) => {
    setCroppedAreaPixels(croppedPixels);
  }, []);

  const getCroppedImg = async () => {
    const canvas = document.createElement("canvas");
    const imageEl = new Image();
    imageEl.src = image;
    await new Promise((r) => (imageEl.onload = r));

    const ctx = canvas.getContext("2d");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    ctx.drawImage(
      imageEl,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    const base64 = canvas.toDataURL("image/jpeg");
    onSave(base64);
  };

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-6 w-11/12 max-w-md relative"
      >
        <h3 className="text-center font-semibold mb-3 text-pink-600">
          Adjust your photo 🖼️
        </h3>
        <div className="relative w-full h-[300px] bg-gray-100 rounded-2xl overflow-hidden">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="flex justify-between mt-4">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-pink-500"
          />
        </div>

        <div className="flex justify-between mt-5">
          <button
            onClick={onClose}
            className="w-[48%] py-2 rounded-full bg-gray-200 hover:bg-gray-300 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={getCroppedImg}
            className="w-[48%] py-2 rounded-full bg-pink-500 hover:bg-pink-600 text-white font-semibold"
          >
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
              }
