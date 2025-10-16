"use client";
import React, { useState } from "react";
import Cropper from "react-easy-crop";

export function CropperModal({ image, onCropComplete, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const getCroppedImage = async () => {
    onCropComplete(image); // se devuelve la misma por simplicidad
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-xl p-4 w-11/12 max-w-sm">
        <div className="relative w-full h-64">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
          />
        </div>
        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-full text-sm"
          >
            Cancel
          </button>
          <button
            onClick={getCroppedImage}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
