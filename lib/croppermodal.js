"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// Import dinámico del cropper (Next.js friendly)
const Cropper = dynamic(() => import("react-easy-crop"), { ssr: false });

export default function CropperModal({ open, onClose, onDone }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => setImageSrc(reader.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const getCroppedImg = useCallback(async () => {
    if (!imageSrc) return;
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = imageSrc;
    await new Promise((resolve) => (image.onload = resolve));

    const ctx = canvas.getContext("2d");
    const size = Math.min(image.width, image.height);
    canvas.width = size;
    canvas.height = size;
    ctx.drawImage(image, 0, 0, size, size, 0, 0, size, size);

    onDone(canvas.toDataURL("image/jpeg"));
  }, [imageSrc, onDone]);

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="bg-white rounded-3xl shadow-xl p-5 w-[92%] max-w-sm flex flex-col gap-4 relative">
        {!imageSrc ? (
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="text-sm"
          />
        ) : (
          <div className="relative w-full h-[380px] bg-black/70 rounded-xl overflow-hidden">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="rect"
              showGrid={true}
              objectFit="cover"
              onCropChange={setCrop}
              onZoomChange={setZoom}
              zoomWithTouch={true}
              restrictPosition={false}
            />
          </div>
        )}

        <div className="flex justify-between gap-4 mt-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-gray-200 py-2 font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          {imageSrc && (
            <button
              onClick={getCroppedImg}
              className="flex-1 rounded-full bg-yellow-400 py-2 font-semibold text-[#3b2b1f] hover:bg-yellow-300"
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* 🔥 CSS embebido: hace visible el área del crop en todas las builds */}
      <style jsx global>{`
        .reactEasyCrop_Container {
          position: absolute !important;
          inset: 0 !important;
          background: #000 !important;
          touch-action: none !important;
        }
        .reactEasyCrop_CropArea {
          border: 2px solid rgba(255, 255, 255, 0.8) !important;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5);
        }
        .reactEasyCrop_CropAreaGrid {
          opacity: 0.9;
        }
      `}</style>
    </motion.div>
  );
      }
