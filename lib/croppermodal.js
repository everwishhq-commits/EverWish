"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

// ✅ import dinámico del cropper para evitar errores en build de Vercel
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
      <div className="bg-white rounded-3xl shadow-xl p-5 w-[90%] max-w-sm flex flex-col gap-4">
        {!imageSrc ? (
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="text-sm"
          />
        ) : (
          <div className="relative w-full h-[360px] bg-gray-100 rounded-xl overflow-hidden border border-pink-200">
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

      {/* 👇 estilo mínimo embebido para que el cropper se vea sin importar el build */}
      <style jsx global>{`
        .reactEasyCrop_Container {
          touch-action: none;
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          background: #000;
        }
        .reactEasyCrop_CropAreaGrid {
          border: 2px solid rgba(255, 255, 255, 0.8);
        }
      `}</style>
    </motion.div>
  );
          }
