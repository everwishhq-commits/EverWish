"use client";

import { motion } from "framer-motion";
import Cropper from "react-easy-crop";
import { useState, useCallback } from "react";

/**
 * 📸 CropperModal – Modal de recorte y centrado de imagen
 * -------------------------------------------------------
 * Props:
 *  - open: booleano que controla la visibilidad
 *  - onClose: función para cerrar el modal
 *  - onDone: función que recibe la imagen recortada (en base64)
 */

export default function CropperModal({ open, onClose, onDone }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (err) => reject(err));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => resolve(reader.result);
        },
        "image/jpeg",
        0.8 // compresión 80%
      );
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => setImageSrc(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
    onDone(croppedImage);
    onClose();
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="relative bg-white rounded-3xl shadow-2xl w-[95%] max-w-lg p-6 overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
          ✂️ Edit and Center Your Image
        </h2>

        {!imageSrc ? (
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-pink-300 rounded-2xl py-12">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="uploadInput"
            />
            <label
              htmlFor="uploadInput"
              className="cursor-pointer bg-pink-100 text-pink-600 px-5 py-3 rounded-full font-semibold hover:bg-pink-200"
            >
              📸 Choose Image
            </label>
          </div>
        ) : (
          <div className="relative w-full h-[300px] bg-gray-200 rounded-2xl overflow-hidden mb-4">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
        )}

        {imageSrc && (
          <>
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-gray-500">Zoom</span>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-3/4 accent-pink-500"
              />
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="rounded-full bg-gray-200 px-6 py-2 font-semibold text-gray-700 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="rounded-full bg-pink-500 px-6 py-2 font-semibold text-white hover:bg-pink-600"
              >
                Save
              </button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
    }
