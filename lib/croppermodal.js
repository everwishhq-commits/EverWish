// 📄 lib/croppermodal.js
"use client";

import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";

/**
 * Componente CropperModal
 * - Permite seleccionar, recortar y guardar una imagen del usuario.
 * - Devuelve la imagen final en base64 lista para mostrar en el diseño de la tarjeta.
 *
 * Props:
 *  - imageSrc: string (la imagen que el usuario seleccionó)
 *  - onSave: función (retorna la imagen final recortada en base64)
 *  - onClose: función (cierra el modal)
 */

export default function CropperModal({ imageSrc, onSave, onClose }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  // Convertir canvas a base64
  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.onload = () => resolve(image);
      image.onerror = (err) => reject(err);
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, cropPixels, rotation = 0) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const safeArea = Math.max(image.width, image.height) * 2;
    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);
    ctx.drawImage(
      image,
      safeArea / 2 - image.width / 2,
      safeArea / 2 - image.height / 2
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);
    canvas.width = cropPixels.width;
    canvas.height = cropPixels.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width / 2 - cropPixels.x),
      Math.round(0 - safeArea / 2 + image.height / 2 - cropPixels.y)
    );

    return canvas.toDataURL("image/jpeg");
  };

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onSave?.(croppedImage);
      onClose?.();
    } catch (err) {
      console.error("Error cropping image:", err);
    }
  }, [imageSrc, croppedAreaPixels, rotation, onSave, onClose]);

  if (!imageSrc) return null;

  return (
    <div className="fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-md p-6 relative flex flex-col items-center">
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
          Adjust Your Photo
        </h2>
        <p className="text-sm text-gray-500 mb-4 text-center">
          Pinch, zoom, and rotate to fit your style ✨
        </p>

        {/* Cropper */}
        <div className="relative w-full h-64 bg-gray-100 rounded-xl overflow-hidden">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
          />
        </div>

        {/* Controls */}
        <div className="w-full mt-4">
          <label className="block text-sm text-gray-600">Zoom</label>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-pink-500"
          />

          <label className="block text-sm text-gray-600 mt-3">Rotate</label>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={rotation}
            onChange={(e) => setRotation(parseFloat(e.target.value))}
            className="w-full accent-pink-500"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-between w-full mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-full bg-pink-500 text-white font-semibold hover:bg-pink-600 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
              }
