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

  // 🚫 Evita que el scroll o zoom del navegador interfiera
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      document.addEventListener("touchmove", preventScroll, { passive: false });
    } else {
      document.body.style.overflow = "";
      document.removeEventListener("touchmove", preventScroll);
    }
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("touchmove", preventScroll);
    };
  }, [open]);

  const preventScroll = (e) => {
    if (e.target.tagName !== "BUTTON" && e.target.tagName !== "INPUT") {
      e.preventDefault(); // bloquea scroll/zoom fuera del cropper
    }
  };

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

    // 🔧 Fondo blanco (sin bordes negros)
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, width, height);

    // Mantener proporción al ancho y llenar todo el canvas
    const aspect = img.width / img.height;
    let scaledW = width * scale;
    let scaledH = scaledW / aspect;

    if (scaledH < height) {
      scaledH = height * scale;
      scaledW = scaledH * aspect;
    }

    const x = width / 2 - scaledW / 2 + offset.x;
    const y = height / 2 - scaledH / 2 + offset.y;

    ctx.drawImage(img, x, y, scaledW, scaledH);
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
    const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
    onDone(dataUrl);
  };

  if (!open) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="bg-white rounded-3xl shadow-xl p-4 w-[94%] max-w-sm flex flex-col gap-3"
        style={{ touchAction: "none" }} // 🚫 evita scroll y zoom del navegador
      >
        {!imageSrc ? (
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="text-sm"
          />
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={360}
              height={270} // 🔧 relación perfecta 4:3
              className="rounded-xl bg-white w-full h-auto object-contain"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
            />

            {/* Controles de Zoom */}
            <div className="flex justify-center gap-4 mt-2">
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

        {/* Botones */}
        <div className="flex justify-between gap-3 mt-2">
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
