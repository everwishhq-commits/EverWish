// lib/croppermodal.js
"use client";
import { useState } from "react";

export default function CropperModal({ open, onClose, onDone }) {
  const [zoom, setZoom] = useState(1);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1200] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[90%] max-w-sm rounded-2xl bg-white p-5 shadow-xl">
        <h3 className="text-lg font-semibold mb-4">✂️ Edit and Center Your Image</h3>

        {/* placeholder del crop (ya usas react-easy-crop en tu repo, aquí sólo UI simple) */}
        <div className="mb-4 h-48 rounded-xl bg-gray-100 border flex items-center justify-center text-gray-500">
          Preview / Crop Area
        </div>

        <label className="text-sm text-gray-700">Zoom</label>
        <input
          type="range"
          min={0.8}
          max={2}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(parseFloat(e.target.value))}
          className="w-full mb-5"
        />

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="rounded-full px-4 py-2 bg-gray-200">Cancel</button>
          <button
            onClick={() => onDone({ dataUrl: "inline-image-data" })}
            className="rounded-full px-4 py-2 bg-pink-500 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
              }
