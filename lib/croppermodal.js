// /lib/croppermodal.js
"use client";
import { useState } from "react";
import Cropper from "react-easy-crop";

export default function CropperModal({ imageSrc, onSave, onCancel }) {
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });

  const handleSave = () => onSave(imageSrc);

  return (
    <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl p-4 w-80 shadow-xl text-center">
        <h3 className="font-semibold mb-3">✂️ Center Your Image</h3>
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
          className="w-full mt-3"
        />
        <div className="flex justify-between mt-3">
          <button
            onClick={onCancel}
            className="bg-gray-200 px-4 py-1 rounded-xl"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="bg-pink-500 text-white px-4 py-1 rounded-xl"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
              }
