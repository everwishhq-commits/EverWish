// lib/croppermodal.js
// Modal simple para subir + crop básico (zoom) y devolver dataURL

import { useEffect, useRef, useState } from "react";

export default function CropperModal({ open = true, onClose, onDone, aspect = 4 / 3 }) {
  const [src, setSrc] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [img, setImg] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!img || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    // clear
    ctx.fillStyle = "#f3f4f6";
    ctx.fillRect(0, 0, W, H);

    if (!src) return;

    // draw image centered with zoom
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const boxW = W;
    const boxH = H;
    const scale = Math.max((boxW / iw), (boxH / ih)) * zoom;

    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (boxW - dw) / 2;
    const dy = (boxH - dh) / 2;

    ctx.drawImage(img, dx, dy, dw, dh);
  }, [img, zoom, src]);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result);
    reader.readAsDataURL(file);
  };

  const confirm = () => {
    if (!canvasRef.current) return;
    onDone?.(canvasRef.current.toDataURL("image/jpeg", 0.9));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center bg-black/60">
      <div className="relative w-11/12 max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          ✕
        </button>

        <h3 className="mb-4 text-center text-xl font-bold text-yellow-600">
          Add & Crop Image 📸
        </h3>

        <div className="mb-3 flex justify-center">
          <label className="cursor-pointer rounded-full bg-pink-500 px-4 py-2 font-semibold text-white hover:bg-pink-600">
            Upload
            <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </label>
        </div>

        <div className="mx-auto mb-3 w-full max-w-md overflow-hidden rounded-2xl border bg-gray-50">
          {/* lienzo con relación de aspecto controlada */}
          <div
            className="relative w-full"
            style={{ aspectRatio: `${aspect}` }}
          >
            <canvas
              ref={canvasRef}
              width={800}
              height={800 / aspect}
              className="h-full w-full"
            />
          </div>
        </div>

        {src && (
          <>
            <img
              src={src}
              alt="preview"
              className="hidden"
              onLoad={(e) => setImg(e.currentTarget)}
            />
            <div className="mb-4 flex items-center gap-3">
              <span className="text-sm text-gray-500">Zoom</span>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full"
              />
            </div>
          </>
        )}

        <div className="mt-3 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-gray-100 py-3 font-semibold text-gray-600 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={confirm}
            disabled={!src}
            className="flex-1 rounded-full bg-yellow-300 py-3 font-semibold text-[#3b2b1f] hover:bg-yellow-400 disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
            }
