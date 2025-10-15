// lib/croppermodal.js
"use client";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";
import { motion } from "framer-motion";

export default function CropperModal({ onClose, onSave }) {
  const [image, setImage] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const handleSave = useCallback(() => {
    if (!image) return;
    onSave(image);
    onClose();
  }, [image, onClose, onSave]);

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-[80]">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-6 shadow-2xl w-11/12 max-w-md relative"
      >
        <h3 className="text-lg font-semibold text-center text-pink-600 mb-3">
          Upload & Adjust Image
        </h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(URL.createObjectURL(e.target.files[0]))}
          className="mb-3 w-full text-sm"
        />
        {image && (
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden mb-3">
            <Cropper image={image} crop={crop} zoom={zoom} aspect={1} onCropChange={setCrop} onZoomChange={setZoom} />
          </div>
        )}
        <div className="flex gap-3">
          <button
            className="flex-1 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600"
            onClick={handleSave}
          >
            Save
          </button>
          <button
            className="flex-1 py-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
            }
