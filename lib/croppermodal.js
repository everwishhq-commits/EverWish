"use client";
import { useState, useRef, useEffect } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "cropperjs-base64";

export default function CropperModal({ onClose, onSave }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const inputRef = useRef(null);

  const triggerFileSelect = () => inputRef.current?.click();

  const onFileChange = async (e) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.addEventListener("load", () => setImageSrc(reader.result));
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSave = async () => {
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onSave(croppedImage);
      onClose();
    } catch (err) {
      console.error("Error cropping image", err);
    }
  };

  useEffect(() => {
    if (!imageSrc) triggerFileSelect();
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center px-5 py-3 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">Add & Adjust Photo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✖
          </button>
        </div>

        <div className="relative w-full h-72 bg-gray-100">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              cropShape="rect"
              aspect={1}
              zoom={zoom}
              rotation={rotation}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={handleCropComplete}
              showGrid={false}
              style={{
                containerStyle: {
                  background: "#fefefe",
                  borderRadius: "12px",
                },
              }}
            />
          ) : (
            <div className="flex flex-col justify-center items-center h-full text-gray-400">
              <p>Select an image to start cropping</p>
            </div>
          )}
        </div>

        <div className="flex flex-col px-5 py-4 gap-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">Zoom</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-2/3 accent-pink-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-600">Rotation</label>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
              className="w-2/3 accent-pink-500"
            />
          </div>

          <div className="flex justify-between mt-3">
            <button
              onClick={triggerFileSelect}
              className="px-4 py-2 text-sm bg-gray-100 rounded-full hover:bg-gray-200"
            >
              Choose another
            </button>
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={onFileChange}
              className="hidden"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
                }
