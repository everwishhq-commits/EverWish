// /lib/croppermodal.js
"use client";
import Cropper from "react-easy-crop";
import { useState } from "react";

export default function CropperModal({ imageSrc, onSave, onCancel }) {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const handleSave = async () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      const size = 800;
      canvas.width = size;
      canvas.height = size;
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob(
        (blob) => {
          const url = URL.createObjectURL(blob);
          onSave(url);
        },
        "image/jpeg",
        0.85
      );
    };
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl p-4 w-80 shadow-lg text-center">
        <p className="font-semibold mb-3">✂️ Edit and Center Your Image</p>
        <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onZoomChange={setZoom}
            onCropChange={setCrop}
          />
        </div>
        <input
          type="range"
          min="1"
          max="3"
          step="0.1"
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="w-full mt-2"
        />
        <div className="flex justify-between mt-3">
          <button
            onClick={onCancel}
            className="bg-gray-200 rounded-xl px-4 py-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-pink-500 text-white rounded-xl px-4 py-1"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
              }
