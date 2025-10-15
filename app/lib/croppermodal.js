/* =========================================================
   📸 CROPPER MODAL — Upload, Crop & Adjust Image
   ========================================================= */

"use client";

import { useState, useRef, useCallback } from "react";
import Cropper from "react-easy-crop";
import { motion } from "framer-motion";

/**
 * @param {Object} props
 * @param {boolean} props.open - If modal is visible
 * @param {Function} props.onClose - Close modal
 * @param {Function} props.onSave - Save cropped image
 */
export default function CropperModal({ open, onClose, onSave }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const inputRef = useRef(null);

  const onCropComplete = useCallback((_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener("load", () => resolve(image));
      image.addEventListener("error", (error) => reject(error));
      image.setAttribute("crossOrigin", "anonymous");
      image.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const safeArea = Math.max(image.width, image.height) * 2;
    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.drawImage(
      image,
      safeArea / 2 - image.width / 2,
      safeArea / 2 - image.height / 2
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width / 2 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height / 2 - pixelCrop.y)
    );

    return new Promise((resolve) => {
      canvas.toBlob((file) => {
        resolve(URL.createObjectURL(file));
      }, "image/jpeg");
    });
  };

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onSave(croppedImage);
      setImageSrc(null);
      onClose();
    } catch (e) {
      alert("Error saving image. Please try again.");
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const imageDataUrl = await readFile(file);
      setImageSrc(imageDataUrl);
    }
  };

  const readFile = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.addEventListener("load", () => resolve(reader.result));
      reader.readAsDataURL(file);
    });

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-black/70 flex justify-center items-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="relative bg-gray-50 flex flex-col items-center justify-center h-[400px]">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1 / 1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              cropShape="rect"
              showGrid={false}
              restrictPosition={true}
            />
          ) : (
            <div className="text-center text-gray-500">
              <p className="mb-3">Upload an image to personalize your card 💖</p>
              <button
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full"
              >
                Choose File
              </button>
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>

        {imageSrc && (
          <div className="p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-600">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
                className="w-2/3"
              />
            </div>

            <div className="flex justify-between mt-3">
              <button
                onClick={() => {
                  setImageSrc(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                ← Back
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-full"
              >
                Save
              </button>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </motion.div>
    </div>
  );
                 }
