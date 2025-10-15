// lib/croppermodal.js
"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";

/* Util: cargar imagen como objeto */
function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

/* Util: rotación en radianes */
const getRadianAngle = (deg) => (deg * Math.PI) / 180;

/* Canvas cropper básico -> dataURL */
async function getCroppedDataURL(imageSrc, crop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const safeArea = Math.max(image.width, image.height) * 2;
  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate(getRadianAngle(rotation));
  ctx.translate(-safeArea / 2, -safeArea / 2);
  ctx.drawImage(image, (safeArea - image.width) / 2, (safeArea - image.height) / 2);

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  // Set canvas to desired crop size
  canvas.width = crop.width;
  canvas.height = crop.height;

  // Draw the cropped image
  ctx.putImageData(
    data,
    Math.round(0 - (safeArea / 2 - image.width / 2) - crop.x),
    Math.round(0 - (safeArea / 2 - image.height / 2) - crop.y)
  );

  return canvas.toDataURL("image/jpeg", 0.92);
}

/* =========================================================
   Default export: Modal de Crop
   Props:
   - onClose(): void
   - onSave(dataUrl: string): void
   ========================================================= */
export default function CropperModal({ onClose, onSave }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.addEventListener("load", () => setImageSrc(reader.result?.toString() || null));
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const save = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const dataUrl = await getCroppedDataURL(imageSrc, croppedAreaPixels, rotation);
    onSave?.(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-[75] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">Add & Adjust Photo</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div className="p-4">
          {!imageSrc ? (
            <div className="flex flex-col items-center justify-center gap-3 py-12 border-2 border-dashed rounded-2xl">
              <p className="text-gray-600 text-sm">Upload an image (JPG/PNG)</p>
              <label className="px-4 py-2 rounded-full bg-pink-500 text-white font-semibold cursor-pointer hover:bg-pink-600">
                Choose file
                <input type="file" accept="image/*" onChange={onFileChange} className="hidden" />
              </label>
            </div>
          ) : (
            <>
              <div className="relative w-full h-[50vh] min-h-[320px] bg-gray-100 rounded-2xl overflow-hidden">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={9 / 16} /* vertical, igual que tu card */
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onRotationChange={setRotation}
                  onCropComplete={onCropComplete}
                  objectFit="contain"
                  restrictPosition={false}
                  showGrid={false}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Zoom</label>
                  <input type="range" min={1} max={3} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} />
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-500 mb-1">Rotation</label>
                  <input type="range" min={-45} max={45} step={1} value={rotation} onChange={(e) => setRotation(Number(e.target.value))} />
                </div>
                <div className="flex items-end">
                  <button
                    onClick={() => setImageSrc(null)}
                    className="w-full rounded-full py-2 text-sm font-semibold border border-gray-300 hover:bg-gray-50"
                  >
                    Choose another
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-4 border-t flex gap-3 justify-end">
          <button onClick={onClose} className="rounded-full px-5 py-2 font-semibold text-gray-700 border hover:bg-gray-50">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={!imageSrc || !croppedAreaPixels}
            className={`rounded-full px-5 py-2 font-semibold text-white ${imageSrc ? "bg-pink-500 hover:bg-pink-600" : "bg-pink-300 cursor-not-allowed"}`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
                          }
