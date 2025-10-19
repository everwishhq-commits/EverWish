"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function CropperModal({ open, onClose, onDone }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const lastTouch = useRef(null);

  useEffect(() => {
    if (!open || !imageSrc) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => draw(ctx, img, scale, offset);
    imageRef.current = img;
  }, [imageSrc, scale, offset, open]);

  const draw = (ctx, img, scale, offset) => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    const scaledW = img.width * scale;
    const scaledH = img.height * scale;
    const x = width / 2 - scaledW / 2 + offset.x;
    const y = height / 2 - scaledH / 2 + offset.y;

    // Dibujar imagen sin bordes visibles
    ctx.fillStyle = "#000"; // fondo para detectar límites
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(img, x, y, scaledW, scaledH);

    // Borde de referencia (sin cuadrícula)
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 3;
    ctx.strokeRect(0, 0, width, height);
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImageSrc(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e) => {
    if (!lastTouch.current || !imageRef.current) return;
    if (e.touches.length === 1) {
      const dx = e.touches[0].clientX - lastTouch.current.x;
      const dy = e.touches[0].clientY - lastTouch.current.y;
      setOffset((p) => ({ x: p.x + dx, y: p.y + dy }));
      lastTouch.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleZoomIn = () => setScale((s) => Math.min(3, s + 0.1));
  const handleZoomOut = () => setScale((s) => Math.max(0.5, s - 0.1));

  const handleDone = () => {
    const canvas = canvasRef.current;
    onDone(canvas.toDataURL("image/jpeg"));
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="bg-white rounded-3xl shadow-xl p-4 w-[94%] max-w-sm flex flex-col gap-3">
        {!imageSrc ? (
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="text-sm"
          />
        ) : (
          <>
            {/* Área del preview real */}
            <div className="relative w-full flex justify-center items-center">
              <canvas
                ref={canvasRef}
                width={340}
                height={340}
                className="rounded-2xl bg-black"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
              />
            </div>

            {/* Botones de Zoom */}
            <div className="flex justify-center gap-4 mt-3">
              <button
                onClick={handleZoomOut}
                className="w-10 h-10 rounded-full bg-gray-200 text-xl font-bold hover:bg-gray-300"
              >
                −
              </button>
              <button
                onClick={handleZoomIn}
                className="w-10 h-10 rounded-full bg-gray-200 text-xl font-bold hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </>
        )}

        {/* Botones inferiores */}
        <div className="flex justify-between gap-3 mt-3">
          <button
            onClick={onClose}
            className="flex-1 rounded-full bg-gray-200 py-2 font-medium text-gray-700 hover:bg-gray-300"
          >
            Cancel
          </button>
          {imageSrc && (
            <button
              onClick={handleDone}
              className="flex-1 rounded-full bg-yellow-400 py-2 font-semibold text-[#3b2b1f] hover:bg-yellow-300"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
      }
